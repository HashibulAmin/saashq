"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formConsumers = void 0;
const formConsumers = (params) => {
    const { name, consumeRPCQueue, systemFields } = params;
    if (systemFields) {
        consumeRPCQueue(`${name}:systemFields`, async (args) => {
            const data = await systemFields(args);
            return {
                status: 'success',
                data
            };
        });
    }
};
exports.formConsumers = formConsumers;
