import { IModels } from './connectionResolver';
import { debugError, debugFacebook } from './debuggers';
import {
  getPageAccessToken,
  refreshPageAccesToken,
  subscribePage,
  unsubscribePage,
} from './utils';
import { getEnv, resetConfigsCache } from './commonUtils';
import fetch from 'node-fetch';

export const removeIntegration = async (
  models: IModels,
  integrationSaasHQApiId: string,
): Promise<string> => {
  const integration = await models.Integrations.findOne({
    saashqApiId: integrationSaasHQApiId,
  });

  if (!integration) {
    throw new Error('Integration not found');
  }

  // Remove endpoint
  let integrationRemoveBy;

  const { _id, kind, accountId, saashqApiId } = integration;

  const account = await models.Accounts.findOne({ _id: accountId });

  const selector = { integrationId: _id };

  if (kind.includes('facebook')) {
    debugFacebook('Removing entries');

    if (!account) {
      throw new Error('Account not found');
    }

    for (const pageId of integration.facebookPageIds || []) {
      let pageTokenResponse;

      try {
        pageTokenResponse = await getPageAccessToken(pageId, account.token);
      } catch (e) {
        debugError(
          `Error ocurred while trying to get page access token with ${e.message}`,
        );
      }

      await models.PostConversations.deleteMany({ recipientId: pageId });
      await models.CommentConversation.deleteMany({ recipientId: pageId });

      try {
        await unsubscribePage(pageId, pageTokenResponse);
      } catch (e) {
        debugError(
          `Error occured while trying to unsubscribe page pageId: ${pageId}`,
        );
      }
    }

    integrationRemoveBy = { fbPageIds: integration.facebookPageIds };

    const conversationIds =
      await models.Conversations.find(selector).distinct('_id');

    await models.Customers.deleteMany({
      integrationId: integrationSaasHQApiId,
    });

    await models.Conversations.deleteMany(selector);
    await models.ConversationMessages.deleteMany({
      conversationId: { $in: conversationIds },
    });

    await models.Integrations.deleteOne({ _id });
  }

  // Remove from core =========
  const ENDPOINT_URL = getEnv({ name: 'ENDPOINT_URL' });
  const DOMAIN = getEnv({ name: 'DOMAIN' });

  if (ENDPOINT_URL) {
    // send domain to core endpoints
    try {
      await fetch(`${ENDPOINT_URL}/remove-endpoint`, {
        method: 'POST',
        body: JSON.stringify({
          domain: DOMAIN,
          ...integrationRemoveBy,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  await models.Integrations.deleteOne({ _id });

  return saashqApiId;
};

export const removeAccount = async (
  models: IModels,
  _id: string,
): Promise<{ saashqApiIds: string | string[] } | Error> => {
  const account = await models.Accounts.findOne({ _id });

  if (!account) {
    return new Error(`Account not found: ${_id}`);
  }

  const saashqApiIds: string[] = [];

  const integrations = await models.Integrations.find({
    accountId: account._id,
  });

  if (integrations.length > 0) {
    for (const integration of integrations) {
      try {
        const response = await removeIntegration(
          models,
          integration.saashqApiId,
        );
        saashqApiIds.push(response);
      } catch (e) {
        throw e;
      }
    }
  }

  await models.Accounts.deleteOne({ _id });

  return { saashqApiIds };
};

export const repairIntegrations = async (
  models: IModels,
  integrationId: string,
): Promise<true | Error> => {
  const integration = await models.Integrations.findOne({
    saashqApiId: integrationId,
  });

  if (!integration) {
    throw new Error('Integration not found');
  }

  for (const pageId of integration.facebookPageIds || []) {
    const pageTokens = await refreshPageAccesToken(models, pageId, integration);

    await subscribePage(pageId, pageTokens[pageId]);

    await models.Integrations.deleteOne({
      saashqApiId: { $ne: integrationId },
      facebookPageIds: pageId,
      kind: integration.kind,
    });
  }

  await models.Integrations.updateOne(
    { saashqApiId: integrationId },
    { $set: { healthStatus: 'healthy', error: '' } },
  );

  const ENDPOINT_URL = getEnv({ name: 'ENDPOINT_URL' });
  const DOMAIN = getEnv({ name: 'DOMAIN' });

  if (ENDPOINT_URL) {
    // send domain to core endpoints
    try {
      await fetch(`${ENDPOINT_URL}/update-endpoint`, {
        method: 'POST',
        body: JSON.stringify({
          domain: `${DOMAIN}/gateway/pl:facebook`,
          facebookPageIds: integration.facebookPageIds,
          fbPageIds: integration.facebookPageIds,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e) {
      throw e;
    }
  }

  return true;
};

export const removeCustomers = async (models: IModels, params) => {
  const { customerIds } = params;
  const selector = { saashqApiId: { $in: customerIds } };

  await models.Customers.deleteMany(selector);
};

export const updateConfigs = async (
  models: IModels,
  configsMap,
): Promise<void> => {
  await models.Configs.updateConfigs(configsMap);

  await resetConfigsCache();
};

export const routeErrorHandling = (fn, callback?: any) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (e) {
      if (callback) {
        return callback(res, e, next);
      }

      debugError(e.message);

      return next(e);
    }
  };
};

export const facebookGetCustomerPosts = async (
  models: IModels,
  { customerId },
) => {
  const customer = await models.Customers.findOne({ saashqApiId: customerId });

  if (!customer) {
    return [];
  }

  const result = await models.CommentConversation.aggregate([
    { $match: { senderId: customer.userId } },
    {
      $lookup: {
        from: 'posts_conversations_facebooks',
        localField: 'postId',
        foreignField: 'postId',
        as: 'post',
      },
    },
    {
      $unwind: {
        path: '$post',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        conversationId: '$post.saashqApiId',
      },
    },
    {
      $project: { _id: 0, conversationId: 1 },
    },
  ]);

  const conversationIds = result.map((conv) => conv.conversationId);

  return conversationIds;
};

export const facebookCreateIntegration = async (
  models: IModels,
  { accountId, integrationId, data, kind },
): Promise<{ status: 'success' }> => {
  const facebookPageIds = JSON.parse(data).pageIds;

  const account = await models.Accounts.getAccount({ _id: accountId });

  const integration = await models.Integrations.create({
    kind,
    accountId,
    saashqApiId: integrationId,
    facebookPageIds,
  });

  const ENDPOINT_URL = getEnv({ name: 'ENDPOINT_URL' });
  const DOMAIN = getEnv({ name: 'DOMAIN' });

  let domain = `${DOMAIN}/gateway/pl:facebook`;

  if (process.env.NODE_ENV !== 'production') {
    domain = `${DOMAIN}/pl:facebook`;
  }

  if (ENDPOINT_URL) {
    // send domain to core endpoints
    try {
      await fetch(`${ENDPOINT_URL}/register-endpoint`, {
        method: 'POST',
        body: JSON.stringify({
          domain,
          facebookPageIds,
          fbPageIds: facebookPageIds,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e) {
      await models.Integrations.deleteOne({ _id: integration._id });
      throw e;
    }
  }

  const facebookPageTokensMap: { [key: string]: string } = {};

  for (const pageId of facebookPageIds) {
    try {
      const pageAccessToken = await getPageAccessToken(pageId, account.token);

      facebookPageTokensMap[pageId] = pageAccessToken;

      try {
        await subscribePage(pageId, pageAccessToken);
        debugFacebook(`Successfully subscribed page ${pageId}`);
      } catch (e) {
        debugError(
          `Error ocurred while trying to subscribe page ${e.message || e}`,
        );
        throw e;
      }
    } catch (e) {
      debugError(
        `Error ocurred while trying to get page access token with ${
          e.message || e
        }`,
      );

      throw e;
    }
  }

  integration.facebookPageTokensMap = facebookPageTokensMap;

  await integration.save();

  return { status: 'success' };
};
