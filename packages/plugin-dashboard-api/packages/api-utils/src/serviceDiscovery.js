"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnabledServices = exports.getPluginAddress = exports.isAvailable = exports.isEnabled = exports.leave = exports.join = exports.getService = exports.getServices = exports.redis = void 0;
const dotenv = require("dotenv");
const redis_1 = require("./redis");
dotenv.config();
const { NODE_ENV, LOAD_BALANCER_ADDRESS, ENABLED_SERVICES_JSON, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, SKIP_REDIS } = process.env;
const isDev = NODE_ENV === 'development';
if (!ENABLED_SERVICES_JSON) {
    throw new Error('ENABLED_SERVICES_JSON environment variable is not configured.');
}
const enabledServices = JSON.parse(ENABLED_SERVICES_JSON) || [];
if (!Array.isArray(enabledServices)) {
    throw new Error("ENABLED_SERVICES_JSON environment variable's value must be JSON array");
}
enabledServices.push('core');
exports.redis = redis_1.default;
const generateKey = name => `service:config:${name}`;
const getServices = async () => {
    return enabledServices;
};
exports.getServices = getServices;
const getService = async (name, config) => {
    const result = {
        address: (await exports.redis.get(`service:${name}`)) || '',
        config: { meta: {} }
    };
    if (config) {
        const value = await exports.redis.get(generateKey(name));
        result.config = JSON.parse(value || '{}');
    }
    return result;
};
exports.getService = getService;
const join = async ({ name, port, dbConnectionString, hasSubscriptions = false, hasDashboard = false, importExportTypes, meta }) => {
    await exports.redis.set(generateKey(name), JSON.stringify({
        dbConnectionString,
        hasSubscriptions,
        hasDashboard,
        importExportTypes,
        meta
    }));
    const address = LOAD_BALANCER_ADDRESS ||
        `http://${isDev ? 'localhost' : `plugin-${name}-api`}:${port}`;
    await exports.redis.set(`service:${name}`, address);
    console.log(`$service:${name} joined with ${address}`);
};
exports.join = join;
const leave = async (name, _port) => {
    console.log(`$service:${name} left`);
};
exports.leave = leave;
const isEnabled = name => {
    if (name === 'core')
        return true;
    return enabledServices.includes(name);
};
exports.isEnabled = isEnabled;
exports.isAvailable = exports.isEnabled;
const pluginAddressCache = {};
const getPluginAddress = async (name) => {
    if (!pluginAddressCache[name]) {
        pluginAddressCache[name] = await exports.redis.get(`service:${name}`);
    }
    return pluginAddressCache[name];
};
exports.getPluginAddress = getPluginAddress;
const getEnabledServices = async () => {
    return enabledServices;
};
exports.getEnabledServices = getEnabledServices;
