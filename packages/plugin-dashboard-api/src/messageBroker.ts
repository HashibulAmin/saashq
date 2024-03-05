import { ISendMessageArgs, sendMessage } from '@saashq/api-utils/src/core';
import { serviceDiscovery } from './configs';
import { generateModels } from './connectionResolver';

let client;

export const initBroker = async (cl) => {
  client = cl;

  const { consumeRPCQueue } = client;

  consumeRPCQueue('dashboards:find.count', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    const { query = {} } = data || {};

    return {
      status: 'success',
      data: await models.Dashboards.countDocuments(query),
    };
  });
};

export const sendCoreMessage = (args: ISendMessageArgs): Promise<any> => {
  return sendMessage({
    serviceName: 'core',
    ...args,
  });
};

export const sendInboxMessage = async (
  args: ISendMessageArgs,
): Promise<any> => {
  return sendMessage({
    serviceName: 'inbox',
    ...args,
  });
};

export const sendCardsMessage = async (
  args: ISendMessageArgs,
): Promise<any> => {
  return sendMessage({
    serviceName: 'cards',
    ...args,
  });
};

export const sendTagsMessage = async (args: ISendMessageArgs): Promise<any> => {
  return sendMessage({
    serviceName: 'tags',
    ...args,
  });
};

export default function () {
  return client;
}
