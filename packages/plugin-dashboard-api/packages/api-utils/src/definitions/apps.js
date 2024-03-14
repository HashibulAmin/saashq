"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appSchema = void 0;
const mongoose_1 = require("mongoose");
const utils_1 = require("./utils");
exports.appSchema = new mongoose_1.Schema({
    _id: (0, utils_1.field)({ pkey: true }),
    name: (0, utils_1.field)({ type: String, label: 'App name' }),
    createdAt: (0, utils_1.field)({ type: Date, label: 'Created at', default: new Date() }),
    accessToken: (0, utils_1.field)({ type: String, label: 'Access token' }),
    refreshToken: (0, utils_1.field)({
        type: String,
        label: 'Refresh token used to gain access token'
    }),
    isEnabled: (0, utils_1.field)({ type: Boolean, label: 'Status of the app' }),
    userGroupId: (0, utils_1.field)({ type: String, label: 'User group id' }),
    expireDate: (0, utils_1.field)({ type: Date, label: 'Token expire date' })
});
