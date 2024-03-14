"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnv = void 0;
const debuggers_1 = require("./debuggers");
const getEnv = ({ name, defaultValue }) => {
    const value = process.env[name];
    if (!value && typeof defaultValue !== 'undefined') {
        return defaultValue;
    }
    if (!value) {
        (0, debuggers_1.debugInfo)(`Missing environment variable configuration for ${name}`);
    }
    return value || '';
};
exports.getEnv = getEnv;
