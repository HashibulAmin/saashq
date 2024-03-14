"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDebuggers = exports.debugError = exports.debugInfo = void 0;
const debug_1 = require("debug");
function initDebuggers(configs) {
    exports.debugInfo = (0, debug_1.default)(`saashq-${configs.name}:info`);
    exports.debugError = (0, debug_1.default)(`saashq-${configs.name}:error`);
}
exports.initDebuggers = initDebuggers;
