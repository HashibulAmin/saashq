import {
  MessageArgs,
  MessageArgsOmitService,
  sendMessage,
} from '@saashq/api-utils/src/core';

import { generateModels } from './connectionResolver';
import { consumeRPCQueue } from '@saashq/api-utils/src/messageBroker';

export const setupMessageConsumers = async () => {
  consumeRPCQueue('shqfeed:ShqFeed.find', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    return {
      status: 'success',
      data: await models.ShqFeed.find(data).lean(),
    };
  });
};

export const sendCoreMessage = async (
  args: MessageArgsOmitService,
): Promise<any> => {
  return sendMessage({
    serviceName: 'core',
    ...args,
  });
};

export const sendReactionsMessage = async (
  args: MessageArgsOmitService,
): Promise<any> => {
  return sendMessage({
    serviceName: 'reactions',
    ...args,
  });
};

export const sendCommonMessage = async (args: MessageArgs): Promise<any> => {
  return sendMessage({
    ...args,
  });
};

export const sendNotificationsMessage = async (
  args: MessageArgsOmitService,
): Promise<any> => {
  return sendMessage({
    serviceName: 'notifications',
    ...args,
  });
};

export const sendNotification = (subdomain: string, data) => {
  return sendNotificationsMessage({ subdomain, action: 'send', data });
};

export const sendSHQFeedMessage = async (
  args: MessageArgsOmitService,
): Promise<any> => {
  return sendMessage({
    serviceName: 'shqfeed',
    ...args,
  });
};
