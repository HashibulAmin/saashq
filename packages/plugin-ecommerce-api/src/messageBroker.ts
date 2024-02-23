import { sendMessage } from '@saashq/api-utils/src/core';
import type {
  MessageArgs,
  MessageArgsOmitService,
} from '@saashq/api-utils/src/core';

export const initBroker = async () => {};

export const sendProductsMessage = async (
  args: MessageArgsOmitService,
): Promise<any> => {
  return sendMessage({
    serviceName: 'products',
    ...args,
  });
};
