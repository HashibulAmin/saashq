"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userGroupSchema = exports.permissionSchema = void 0;
const mongoose_1 = require("mongoose");
const utils_1 = require("./utils");
exports.permissionSchema = new mongoose_1.Schema({
    _id: (0, utils_1.field)({ pkey: true }),
    module: (0, utils_1.field)({ type: String, label: 'Module' }),
    action: (0, utils_1.field)({ type: String, label: 'Action' }),
    userId: (0, utils_1.field)({ type: String, label: 'User' }),
    groupId: (0, utils_1.field)({ type: String, label: 'User group' }),
    requiredActions: (0, utils_1.field)({
        type: [String],
        default: [],
        label: 'Required actions'
    }),
    allowed: (0, utils_1.field)({ type: Boolean, default: false, label: 'Allowed' })
});
exports.userGroupSchema = new mongoose_1.Schema({
    _id: (0, utils_1.field)({ pkey: true }),
    name: (0, utils_1.field)({ type: String, unique: true, label: 'Name' }),
    description: (0, utils_1.field)({ type: String, label: 'Description' })
});
