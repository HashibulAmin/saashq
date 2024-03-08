
import { consumeQueue, consumeRPCQueue } from '@saashq/api-utils/src/messageBroker';
import { {Name}s } from "./models";

export const setupMessageConsumers = async () => {
  consumeQueue('{name}:send', async ({ data }) => {
    {Name}s.send(data);

    return {
      status: 'success',
    };
  });

  consumeRPCQueue('{name}:find', async ({ data }) => {
    return {
      status: 'success',
      data: await {Name}s.find({})
    };
  });
};
