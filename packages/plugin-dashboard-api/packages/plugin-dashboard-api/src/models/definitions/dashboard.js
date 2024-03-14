"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardItemSchema = exports.dashboardSchema = void 0;
const mongoose_1 = require("mongoose");
const utils_1 = require("./utils");
exports.dashboardSchema = (0, utils_1.schemaWrapper)(new mongoose_1.Schema({
    _id: (0, utils_1.field)({ pkey: true }),
    name: (0, utils_1.field)({ type: String }),
    description: (0, utils_1.field)({ type: String, optional: true }),
    visibility: (0, utils_1.field)({ type: String, optional: true }),
    selectedMemberIds: (0, utils_1.field)({ type: [String] }),
    parentId: (0, utils_1.field)({ type: String, optional: true }),
    childsDashboard: (0, utils_1.field)({ type: [String] }),
    order: (0, utils_1.field)({ type: String }),
    tagIds: (0, utils_1.field)({
        type: [String],
        optional: true,
        label: 'Tags',
        index: true
    }),
    departmentIds: (0, utils_1.field)({ type: [String], label: 'Departments' }),
    code: (0, utils_1.field)({ type: String }),
    dashboardCount: (0, utils_1.field)({ type: Number }),
    relatedIds: (0, utils_1.field)({ type: [String] }),
    createdAt: {
        type: Date,
        default: new Date(),
        label: 'Created date'
    },
    createdBy: { type: String },
    updatedAt: {
        type: Date,
        default: new Date(),
        label: 'Updated date'
    },
    updatedBy: { type: String }
}));
exports.dashboardItemSchema = new mongoose_1.Schema({
    _id: (0, utils_1.field)({ pkey: true }),
    dashboardId: { type: String },
    layout: (0, utils_1.field)({ type: String }),
    vizState: (0, utils_1.field)({ type: String }),
    name: (0, utils_1.field)({ type: String }),
    type: (0, utils_1.field)({ type: String }),
    isDateRange: (0, utils_1.field)({ type: Boolean })
});
exports.dashboardSchema.index({ type: 1, order: 1, name: 1 });
