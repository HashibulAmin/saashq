import { MessageArgs, sendMessage } from '@saashq/api-utils/src/core';

export const initBroker = async () => {};

export const sendCommonMessage = async (args: MessageArgs): Promise<any> => {
  return sendMessage({
    ...args,
  });
};
