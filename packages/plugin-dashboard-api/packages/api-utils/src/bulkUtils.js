"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = void 0;
const stream_1 = require("stream");
const core_1 = require("./core");
const stream = (executeChunk, transformCallback, generateChildStream, chunkSize) => {
    const variables = {};
    const onFinishPiping = async () => {
        if (variables.parentIds) {
            const chunks = (0, core_1.chunkArray)(variables.parentIds, chunkSize);
            if (chunks.length) {
                for (const chunk of chunks) {
                    await executeChunk(chunk);
                }
            }
        }
    };
    const parentTransformerStream = new stream_1.Transform({
        objectMode: true,
        transform(root, _encoding, callback) {
            transformCallback(variables, root);
            callback();
        }
    });
    const chldStream = generateChildStream().stream();
    return new Promise((resolve, reject) => {
        const pipe = chldStream.pipe(parentTransformerStream);
        pipe.on('finish', async () => {
            try {
                await onFinishPiping();
            }
            catch (e) {
                return reject(e);
            }
            resolve('done');
        });
    });
};
exports.stream = stream;
