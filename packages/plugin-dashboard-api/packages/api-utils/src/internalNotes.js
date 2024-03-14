"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.internalNoteConsumers = void 0;
const internalNoteConsumers = (params) => {
    const { name, consumeRPCQueue, generateInternalNoteNotif } = params;
    if (generateInternalNoteNotif) {
        consumeRPCQueue(`${name}:generateInternalNoteNotif`, async (args) => {
            const data = await generateInternalNoteNotif(args);
            return {
                status: 'success',
                data
            };
        });
    }
};
exports.internalNoteConsumers = internalNoteConsumers;
