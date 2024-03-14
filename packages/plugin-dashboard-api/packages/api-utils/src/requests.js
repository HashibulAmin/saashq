"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToWebhook = exports.routeErrorHandling = exports.sendRequest = void 0;
const requestify = require("requestify");
const messageBroker_1 = require("./messageBroker");
const debuggers_1 = require("./debuggers");
const serviceDiscovery_1 = require("./serviceDiscovery");
/**
 * Sends post request to specific url
 */
const sendRequest = async ({ url, method, headers, form, body, params, timeout }, errorMessage) => {
    (0, debuggers_1.debugExternalApi)(`
    Sending request to
    url: ${url}
    method: ${method}
    body: ${JSON.stringify(body)}
    params: ${JSON.stringify(params)}
  `);
    try {
        const response = await requestify.request(url, {
            method,
            headers: { 'Content-Type': 'application/json', ...(headers || {}) },
            form,
            body,
            params,
            timeout
        });
        const responseBody = response.getBody();
        (0, debuggers_1.debugExternalApi)(`
      Success from : ${url}
      responseBody: ${JSON.stringify(responseBody)}
    `);
        return responseBody;
    }
    catch (e) {
        if (e.code === 'ECONNREFUSED' || e.code === 'ENOTFOUND') {
            throw new Error(errorMessage);
        }
        else {
            const message = e.body || e.message;
            throw new Error(message);
        }
    }
};
exports.sendRequest = sendRequest;
const routeErrorHandling = (fn, callback) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (e) {
            console.log(e.message);
            if (callback) {
                return callback(res, e, next);
            }
            return next(e);
        }
    };
};
exports.routeErrorHandling = routeErrorHandling;
const sendToWebhook = async (_messageBroker, { subdomain, data }) => {
    const isWebhooksAvailable = await (0, serviceDiscovery_1.isEnabled)('webhooks');
    if (isWebhooksAvailable) {
        await (0, messageBroker_1.sendMessage)(`webhooks:send`, {
            subdomain,
            data
        });
    }
};
exports.sendToWebhook = sendToWebhook;
