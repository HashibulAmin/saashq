import { getSubdomain } from '@saashq/api-utils/src/core';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

// import { initBroker } from "./messageBroker";
// import init from "./controller";
import { generateModels } from './models';
import { initBroker, createRoutes } from './server';

export default {
  name: 'zalo',
  graphql: async () => {
    return {
      typeDefs: await typeDefs(),
      resolvers: await resolvers(),
    };
  },
  meta: {
    inboxIntegration: {
      kind: 'zalo',
      label: 'Zalo',
    },
  },
  apolloServerContext: async (context, req) => {
    const subdomain = getSubdomain(req);
    const models = await generateModels(subdomain);

    context.subdomain = req.hostname;
    context.models = models;
    return context;
  },

  onServerInit: async () => {
    initBroker();
    createRoutes();
  },
};
