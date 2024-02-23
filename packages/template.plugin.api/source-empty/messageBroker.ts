
import { sendMessage } from "@saashq/api-utils/src/core";
import type { MessageArgs } from "@saashq/api-utils/src/core";
import { consumeQueue, consumeRPCQueue } from "@saashq/api-utils/src/messageBroker";
import { {Name}s } from "./models";


export const initBroker = async () => {
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