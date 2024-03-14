"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomLowercase = exports.randomAlphanumeric = void 0;
const nanoid_1 = require("nanoid");
exports.randomAlphanumeric = (0, nanoid_1.customAlphabet)('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
exports.randomLowercase = (0, nanoid_1.customAlphabet)('abcdefghijklmnopqrstuvwxyz');
