"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugEmail = exports.debugExternalApi = exports.debugBase = exports.wrapper = exports.debugError = exports.debugInfo = void 0;
const debug_1 = require("debug");
exports.debugInfo = (0, debug_1.default)(`saashq:info`);
exports.debugError = (0, debug_1.default)(`saashq:error`);
const wrapper = instance => {
    return (0, debug_1.default)(instance);
};
exports.wrapper = wrapper;
exports.debugBase = (0, exports.wrapper)('saashq-api');
exports.debugExternalApi = (0, exports.wrapper)('saashq-api:external-api-fetcher');
exports.debugEmail = (0, exports.wrapper)('saashq-api:email');
