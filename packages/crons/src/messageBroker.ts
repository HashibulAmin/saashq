import { sendMessage } from '@saashq/api-utils/src/core';
import type { MessageArgs } from '@saashq/api-utils/src/core';
import { connectToMessageBroker } from '@saashq/api-utils/src/messageBroker';

export const initBroker = async () => {
  await connectToMessageBroker(setupMessageConsumers);
};

export const setupMessageConsumers = async () => {};

export const sendCommonMessage = async (args: MessageArgs): Promise<any> => {
  return sendMessage({
    ...args,
  });
};
