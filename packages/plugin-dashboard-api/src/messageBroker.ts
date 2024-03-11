import { MessageArgs, sendMessage } from '@saashq/api-utils/src/core';
import { generateModels } from './connectionResolver';
import {
  consumeQueue,
  consumeRPCQueue,
} from '@saashq/api-utils/src/messageBroker';

export const setupMessageConsumers = async () => {
  consumeRPCQueue('dashboards2:find.count', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    const { query = {} } = data || {};

    return {
      status: 'success',
      data: await models.Dashboards.countDocuments(query),
    };
  });
};

export const sendCoreMessage = (args: MessageArgs): Promise<any> => {
  return sendMessage({
    ...args,
  });
};

export const sendInboxMessage = async (args: MessageArgs): Promise<any> => {
  return sendMessage({
    ...args,
  });
};

export const sendCardsMessage = async (args: MessageArgs): Promise<any> => {
  return sendMessage({
    ...args,
  });
};

export const sendTagsMessage = async (args: MessageArgs): Promise<any> => {
  return sendMessage({
    ...args,
  });
};
