"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.afterQueryWrapper = void 0;
const redis_1 = require("./redis");
const afterQueryWrapper = async (subdomain, queryName, args, results, messageBroker, user) => {
    const value = await redis_1.default.get('afterQueries');
    const afterQueries = JSON.parse(value || '{}');
    if (!afterQueries[queryName] || !afterQueries[queryName].length) {
        return results;
    }
    for (const service of afterQueries[queryName]) {
        try {
            const perResults = await messageBroker.sendRPCMessage(`${service}:afterQuery`, {
                subdomain,
                data: {
                    queryName,
                    args,
                    results,
                    user
                }
            });
            if (perResults) {
                results = perResults;
            }
        }
        catch (e) {
            console.log(`afterQueries error: ${e}`);
            return results;
        }
    }
    return results;
};
exports.afterQueryWrapper = afterQueryWrapper;
