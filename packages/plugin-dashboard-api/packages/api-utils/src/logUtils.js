"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logConsumers = exports.getSchemaLabels = exports.putActivityLog = exports.putDeleteLog = exports.putUpdateLog = exports.putCreateLog = exports.LOG_ACTIONS = exports.gatherUsernames = exports.gatherNames = void 0;
const redis_1 = require("./redis");
const serviceDiscovery_1 = require("./serviceDiscovery");
/**
 * Finds name field from given collection
 * @param params.foreignKey Name of id fields
 * @param params.prevList Array to save found id with name
 * @param params.nameFields List of values to be mapped to id field
 * @param params.items Mongodb document list
 */
const gatherNames = async (params) => {
    const { foreignKey, prevList, nameFields = [], items = [] } = params;
    let options = [];
    if (prevList && prevList.length > 0) {
        options = prevList;
    }
    if (!items.length) {
        return options;
    }
    for (const item of items) {
        if (item && item._id) {
            let name = '';
            for (const n of nameFields) {
                // first level field
                if (item[n]) {
                    name = item[n];
                }
                // TODO: properly fill nested object fields
            }
            options.push({ [foreignKey]: item._id, name });
        }
    }
    return options;
};
exports.gatherNames = gatherNames;
const gatherUsernames = async (params) => {
    const { foreignKey, prevList, items = [] } = params;
    return (0, exports.gatherNames)({
        foreignKey,
        prevList,
        nameFields: ['email', 'username'],
        items
    });
};
exports.gatherUsernames = gatherUsernames;
exports.LOG_ACTIONS = {
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete'
};
const putCreateLog = async (subdomain, messageBroker, params, user) => {
    const isAutomationsAvailable = await (0, serviceDiscovery_1.isEnabled)('automations');
    if (isAutomationsAvailable) {
        messageBroker.sendMessage('automations:trigger', {
            subdomain,
            data: {
                type: `${params.type}`,
                targets: [params.object]
            }
        });
    }
    const isWebhooksAvailable = await (0, serviceDiscovery_1.isEnabled)('webhooks');
    if (isWebhooksAvailable) {
        messageBroker.sendMessage('webhooks:send', {
            subdomain,
            data: {
                action: exports.LOG_ACTIONS.CREATE,
                type: params.type,
                params
            }
        });
    }
    return putLog(subdomain, messageBroker, { ...params, action: exports.LOG_ACTIONS.CREATE }, user);
};
exports.putCreateLog = putCreateLog;
/**
 * Prepares a create log request to log server
 * @param params Log document params
 * @param user User information from mutation context
 */
const putUpdateLog = async (subdomain, messageBroker, params, user) => {
    const isAutomationsAvailable = await (0, serviceDiscovery_1.isEnabled)('automations');
    if (isAutomationsAvailable) {
        messageBroker.sendMessage('automations:trigger', {
            subdomain,
            data: {
                type: `${params.type}`,
                targets: [params.updatedDocument]
            }
        });
    }
    const isWebhooksAvailable = await (0, serviceDiscovery_1.isEnabled)('webhooks');
    if (isWebhooksAvailable) {
        messageBroker.sendMessage('webhooks:send', {
            subdomain,
            data: {
                action: exports.LOG_ACTIONS.UPDATE,
                type: params.type,
                params
            }
        });
    }
    return putLog(subdomain, messageBroker, { ...params, action: exports.LOG_ACTIONS.UPDATE }, user);
};
exports.putUpdateLog = putUpdateLog;
/**
 * Prepares a create log request to log server
 * @param params Log document params
 * @param user User information from mutation context
 */
const putDeleteLog = async (subdomain, messageBroker, params, user) => {
    const isWebhooksAvailable = await (0, serviceDiscovery_1.isEnabled)('webhooks');
    if (isWebhooksAvailable) {
        messageBroker.sendMessage('webhooks:send', {
            subdomain,
            data: {
                action: exports.LOG_ACTIONS.DELETE,
                type: params.type,
                params
            }
        });
    }
    return putLog(subdomain, messageBroker, { ...params, action: exports.LOG_ACTIONS.DELETE }, user);
};
exports.putDeleteLog = putDeleteLog;
const putLog = async (subdomain, messageBroker, params, user) => {
    const value = await redis_1.default.get('afterMutations');
    const afterMutations = JSON.parse(value || '{}');
    if (afterMutations[params.type] &&
        afterMutations[params.type][params.action] &&
        afterMutations[params.type][params.action].length) {
        for (const service of afterMutations[params.type][params.action]) {
            await messageBroker.sendMessage(`${service}:afterMutation`, {
                subdomain,
                data: {
                    ...params,
                    object: params.object,
                    newData: params.newData,
                    extraDesc: params.extraDesc,
                    user
                }
            });
        }
    }
    const isLoggerAvailable = await (0, serviceDiscovery_1.isEnabled)('logs');
    if (!isLoggerAvailable) {
        return;
    }
    return messageBroker.sendMessage('putLog', {
        subdomain,
        data: {
            ...params,
            createdBy: user._id,
            unicode: user.username || user.email || user._id,
            object: JSON.stringify(params.object),
            newData: JSON.stringify(params.newData),
            extraDesc: JSON.stringify(params.extraDesc)
        }
    });
};
const putActivityLog = async (subdomain, params) => {
    const { messageBroker, data } = params;
    const isAutomationsAvailable = await (0, serviceDiscovery_1.isEnabled)('automations');
    try {
        if (isAutomationsAvailable && data.target) {
            messageBroker.sendMessage('automations:trigger', {
                subdomain,
                data: {
                    type: `${data.contentType}`,
                    targets: [data.target],
                    ...(data.automations || {})
                }
            });
        }
        return messageBroker.sendMessage('putActivityLog', {
            data: params,
            subdomain
        });
    }
    catch (e) {
        return e.message;
    }
};
exports.putActivityLog = putActivityLog;
/**
 * Creates field name-label mapping list from given object
 */
const buildLabelList = (obj = {}) => {
    const list = [];
    const fieldNames = Object.getOwnPropertyNames(obj);
    for (const name of fieldNames) {
        const field = obj[name];
        const label = field && field.label ? field.label : '';
        list.push({ name, label });
    }
    return list;
};
const getSchemaLabels = (type, schemaMappings) => {
    let fieldNames = [];
    const found = schemaMappings.find(m => m.name === type);
    if (found) {
        const schemas = found.schemas || [];
        for (const schema of schemas) {
            // schema comes as either mongoose schema or plain object
            const names = Object.getOwnPropertyNames(schema.obj || schema);
            for (const name of names) {
                const field = schema.obj ? schema.obj[name] : schema[name];
                if (field && field.label) {
                    fieldNames.push({ name, label: field.label });
                }
                // nested object field names
                if (typeof field === 'object' && field.type && field.type.obj) {
                    fieldNames = fieldNames.concat(buildLabelList(field.type.obj));
                }
            }
        } // end schema for loop
    } // end schema name mapping
    return fieldNames;
};
exports.getSchemaLabels = getSchemaLabels;
const logConsumers = (params) => {
    const { name, consumeRPCQueue, getActivityContent, getContentTypeDetail, collectItems, getContentIds, getSchemalabels } = params;
    if (getActivityContent) {
        consumeRPCQueue(`${name}:logs.getActivityContent`, async (args) => ({
            status: 'success',
            data: await getActivityContent(args)
        }));
    }
    if (getContentTypeDetail) {
        consumeRPCQueue(`${name}:logs.getContentTypeDetail`, async (args) => ({
            status: 'success',
            data: await getContentTypeDetail(args)
        }));
    }
    if (collectItems) {
        consumeRPCQueue(`${name}:logs.collectItems`, async (args) => ({
            status: 'success',
            data: await collectItems(args)
        }));
    }
    if (getContentIds) {
        consumeRPCQueue(`${name}:logs.getContentIds`, async (args) => ({
            status: 'success',
            data: await getContentIds(args)
        }));
    }
    if (getSchemalabels) {
        consumeRPCQueue(`${name}:logs.getSchemaLabels`, args => ({
            status: 'success',
            data: getSchemalabels(args)
        }));
    }
};
exports.logConsumers = logConsumers;
