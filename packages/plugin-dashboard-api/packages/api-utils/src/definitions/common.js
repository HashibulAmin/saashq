"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachmentSchema = exports.ruleSchema = exports.customFieldSchema = void 0;
const mongoose_1 = require("mongoose");
const utils_1 = require("./utils");
exports.customFieldSchema = new mongoose_1.Schema({
    field: (0, utils_1.field)({ type: 'String' }),
    value: (0, utils_1.field)({ type: mongoose_1.Schema.Types.Mixed }),
    stringValue: (0, utils_1.field)({ type: 'String', optional: true }),
    numberValue: (0, utils_1.field)({ type: 'Number', optional: true }),
    dateValue: (0, utils_1.field)({ type: 'Date', optional: true })
}, { _id: false });
// schema for form's rules
exports.ruleSchema = new mongoose_1.Schema({
    _id: (0, utils_1.field)({ type: String }),
    // browserLanguage, currentUrl, etc ...
    kind: (0, utils_1.field)({ type: String, label: 'Kind' }),
    // Browser language, Current url etc ...
    text: (0, utils_1.field)({ type: String, label: 'Text' }),
    // is, isNot, startsWith
    condition: (0, utils_1.field)({ type: String, label: 'Condition' }),
    value: (0, utils_1.field)({ type: String, label: 'Value', optional: true })
}, { _id: false });
exports.attachmentSchema = new mongoose_1.Schema({
    name: (0, utils_1.field)({ type: String }),
    url: (0, utils_1.field)({ type: String }),
    type: (0, utils_1.field)({ type: String }),
    size: (0, utils_1.field)({ type: Number, optional: true }),
    duration: (0, utils_1.field)({ type: Number, optional: true })
}, { _id: false });
