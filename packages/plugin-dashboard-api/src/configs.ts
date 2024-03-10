import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { setupMessageConsumers } from './messageBroker';

import { generateModels } from './connectionResolver';
import { getSubdomain } from '@saashq/api-utils/src/core';
import * as permissions from './permissions';
import tags from './tags';

export let serviceDiscovery;
export let debug;

export default {
  name: 'dashboard',
  permissions,
  graphql: async (sd) => {
    serviceDiscovery = sd;

    return {
      typeDefs: await typeDefs(sd),
      resolvers,
    };
  },
  hasSubscriptions: false,

  segment: {},
  meta: { logs: {}, permissions, tags },
  apolloServerContext: async (context, req) => {
    const subdomain = getSubdomain(req);

    context.subdomain = subdomain;
    context.models = await generateModels(subdomain);
  },
  onServerInit: async () => {},
  setupMessageConsumers,
};
