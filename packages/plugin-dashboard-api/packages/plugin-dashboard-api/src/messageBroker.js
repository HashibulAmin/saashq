"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTagsMessage = exports.sendCardsMessage = exports.sendInboxMessage = exports.sendCoreMessage = exports.initBroker = void 0;
const core_1 = require("@erxes/api-utils/src/core");
const configs_1 = require("./configs");
const connectionResolver_1 = require("./connectionResolver");
let client;
const initBroker = async (cl) => {
    client = cl;
    const { consumeRPCQueue } = client;
    consumeRPCQueue('dashboards:find.count', async ({ subdomain, data }) => {
        const models = await (0, connectionResolver_1.generateModels)(subdomain);
        const { query = {} } = data || {};
        return {
            status: 'success',
            data: await models.Dashboards.countDocuments(query)
        };
    });
};
exports.initBroker = initBroker;
const sendCoreMessage = (args) => {
    return (0, core_1.sendMessage)({
        client,
        serviceDiscovery: configs_1.serviceDiscovery,
        serviceName: 'core',
        ...args
    });
};
exports.sendCoreMessage = sendCoreMessage;
const sendInboxMessage = async (args) => {
    return (0, core_1.sendMessage)({
        client,
        serviceDiscovery: configs_1.serviceDiscovery,
        serviceName: 'inbox',
        ...args
    });
};
exports.sendInboxMessage = sendInboxMessage;
const sendCardsMessage = async (args) => {
    return (0, core_1.sendMessage)({
        client,
        serviceDiscovery: configs_1.serviceDiscovery,
        serviceName: 'cards',
        ...args
    });
};
exports.sendCardsMessage = sendCardsMessage;
const sendTagsMessage = async (args) => {
    return (0, core_1.sendMessage)({
        client,
        serviceDiscovery: configs_1.serviceDiscovery,
        serviceName: 'tags',
        ...args
    });
};
exports.sendTagsMessage = sendTagsMessage;
function default_1() {
    return client;
}
exports.default = default_1;
