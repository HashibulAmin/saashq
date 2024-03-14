"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachmentSchema = exports.customFieldSchema = exports.ruleSchema = void 0;
const mongoose_1 = require("mongoose");
// schema for form's rules
exports.ruleSchema = new mongoose_1.Schema({
    _id: { type: String },
    // browserLanguage, currentUrl, etc ...
    kind: { type: String, label: 'Kind' },
    // Browser language, Current url etc ...
    text: { type: String, label: 'Text' },
    // is, isNot, startsWith
    condition: { type: String, label: 'Condition' },
    value: { type: String, label: 'Value', optional: true }
}, { _id: false });
exports.customFieldSchema = new mongoose_1.Schema({
    field: { type: String },
    value: { type: mongoose_1.Schema.Types.Mixed },
    stringValue: { type: String, optional: true },
    numberValue: { type: Number, optional: true },
    dateValue: { type: Date, optional: true },
    locationValue: {
        type: {
            type: String,
            enum: ['Point'],
            optional: true
        },
        coordinates: {
            type: [Number],
            optional: true
        },
        required: false
    }
}, { _id: false });
exports.customFieldSchema.index({ locationValue: '2dsphere' });
exports.attachmentSchema = new mongoose_1.Schema({
    name: { type: String },
    url: { type: String },
    type: { type: String },
    size: { type: Number, optional: true },
    duration: { type: Number, optional: true }
}, { _id: false });
