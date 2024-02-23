import {
  MessageArgs,
  MessageArgsOmitService,
  sendMessage,
} from '@saashq/api-utils/src/core';

import { generateModels } from './connectionResolver';
import { consumeRPCQueue } from '@saashq/api-utils/src/messageBroker';

export const initBroker = async () => {
  consumeRPCQueue('payment:invoices.findOne', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    return {
      status: 'success',
      data: await models.Invoices.findOne(data).lean(),
    };
  });
};

export const sendContactsMessage = async (
  args: MessageArgsOmitService,
): Promise<any> => {
  return sendMessage({
    serviceName: 'contacts',
    ...args,
  });
};

export const sendCommonMessage = async (
  serviceName: string,
  args: MessageArgsOmitService,
): Promise<any> => {
  return sendMessage({
    serviceName,
    ...args,
  });
};

export const sendInboxMessage = async (
  args: MessageArgsOmitService,
): Promise<any> => {
  return sendMessage({
    serviceName: 'inbox',
    ...args,
  });
};
