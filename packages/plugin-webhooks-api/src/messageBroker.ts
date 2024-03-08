import { generateModels } from './connectionResolver';
import { MessageArgs, sendMessage } from '@saashq/api-utils/src/core';
import { send } from './utils';
import { consumeQueue } from '@saashq/api-utils/src/messageBroker';

export const setupMessageConsumers = async () => {
  consumeQueue('webhooks:send', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    return {
      status: 'success',
      data: await send(models, subdomain, data),
    };
  });
};

export const sendCommonMessage = async (args: MessageArgs) => {
  return sendMessage({
    ...args,
  });
};
