"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = exports.serviceDiscovery = exports.graphqlPubsub = exports.mainDb = void 0;
const typeDefs_1 = require("./graphql/typeDefs");
const resolvers_1 = require("./graphql/resolvers");
const messageBroker_1 = require("./messageBroker");
const connectionResolver_1 = require("./connectionResolver");
const core_1 = require("@saashq/api-utils/src/core");
const permissions = require("./permissions");
const tags_1 = require("./tags");
exports.default = {
    name: 'dashboard',
    permissions,
    graphql: async (sd) => {
        exports.serviceDiscovery = sd;
        return {
            typeDefs: await (0, typeDefs_1.default)(sd),
            resolvers: resolvers_1.default
        };
    },
    hasSubscriptions: false,
    segment: {},
    meta: { logs: {}, permissions, tags: tags_1.default },
    apolloServerContext: async (context, req) => {
        const subdomain = (0, core_1.getSubdomain)(req);
        context.subdomain = subdomain;
        context.models = await (0, connectionResolver_1.generateModels)(subdomain);
    },
    onServerInit: async (options) => {
        exports.mainDb = options.db;
        (0, messageBroker_1.initBroker)(options.messageBrokerClient);
        exports.debug = options.debug;
        exports.graphqlPubsub = options.pubsubClient;
    }
};
