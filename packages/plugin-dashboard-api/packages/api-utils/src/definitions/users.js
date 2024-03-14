"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const types_1 = require("../types");
const utils_1 = require("./utils");
const constants_1 = require("../constants");
// Mongoose schemas ===============================
const emailSignatureSchema = new mongoose_1.Schema({
    brandId: (0, utils_1.field)({ type: String, label: 'Email signature nrand' }),
    signature: (0, utils_1.field)({ type: String, label: 'Email signature' })
}, { _id: false });
// Detail schema
const detailSchema = new mongoose_1.Schema({
    avatar: (0, utils_1.field)({ type: String, label: 'Avatar' }),
    shortName: (0, utils_1.field)({ type: String, optional: true, label: 'Short name' }),
    fullName: (0, utils_1.field)({ type: String, label: 'Full name' }),
    birthDate: (0, utils_1.field)({ type: Date, label: 'Birth date' }),
    workStartedDate: (0, utils_1.field)({ type: Date, label: 'Date to joined to work' }),
    position: (0, utils_1.field)({ type: String, label: 'Position' }),
    location: (0, utils_1.field)({ type: String, optional: true, label: 'Location' }),
    description: (0, utils_1.field)({ type: String, optional: true, label: 'Description' }),
    operatorPhone: (0, utils_1.field)({
        type: String,
        optional: true,
        label: 'Operator phone'
    }),
    firstName: (0, utils_1.field)({ type: String, label: 'First name' }),
    middleName: (0, utils_1.field)({ type: String, label: 'Middle name' }),
    lastName: (0, utils_1.field)({ type: String, label: 'Last name' })
}, { _id: false });
// User schema
exports.userSchema = (0, utils_1.schemaWrapper)(new mongoose_1.Schema({
    _id: (0, utils_1.field)({ pkey: true }),
    createdAt: (0, utils_1.field)({
        type: Date,
        default: Date.now,
        label: 'Created at'
    }),
    username: (0, utils_1.field)({ type: String, label: 'Username' }),
    password: (0, utils_1.field)({ type: String }),
    resetPasswordToken: (0, utils_1.field)({ type: String }),
    registrationToken: (0, utils_1.field)({ type: String }),
    registrationTokenExpires: (0, utils_1.field)({ type: Date }),
    resetPasswordExpires: (0, utils_1.field)({ type: Date }),
    isOwner: (0, utils_1.field)({ type: Boolean, label: 'Is owner' }),
    departmentIds: (0, utils_1.field)({ type: [String], label: 'Department Ids' }),
    branchIds: (0, utils_1.field)({ type: [String], label: 'Branch Ids' }),
    email: (0, utils_1.field)({
        type: String,
        unique: true,
        match: [
            /**
             * RFC 5322 compliant regex. Taken from http://emailregex.com/
             */
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please fill a valid email address'
        ],
        label: 'Email'
    }),
    getNotificationByEmail: (0, utils_1.field)({
        type: Boolean,
        label: 'Get notification by email'
    }),
    emailSignatures: (0, utils_1.field)({
        type: [emailSignatureSchema],
        label: 'Email signatures'
    }),
    starredConversationIds: (0, utils_1.field)({
        type: [String],
        label: 'Starred conversations'
    }),
    details: (0, utils_1.field)({ type: detailSchema, default: {}, label: 'Details' }),
    links: (0, utils_1.field)({ type: Object, default: {}, label: 'Links' }),
    isActive: (0, utils_1.field)({ type: Boolean, default: true, label: 'Is active' }),
    brandIds: (0, utils_1.field)({ type: [String], label: 'Brands' }),
    groupIds: (0, utils_1.field)({ type: [String], label: 'Groups' }),
    deviceTokens: (0, utils_1.field)({
        type: [String],
        default: [],
        label: 'Device tokens'
    }),
    code: (0, utils_1.field)({ type: String }),
    doNotDisturb: (0, utils_1.field)({
        type: String,
        optional: true,
        default: 'No',
        label: 'Do not disturb'
    }),
    isSubscribed: (0, utils_1.field)({
        type: String,
        optional: true,
        default: 'Yes',
        label: 'Subscribed'
    }),
    isShowNotification: (0, utils_1.field)({
        type: Boolean,
        optional: true,
        default: false,
        label: 'Check if user shows'
    }),
    score: (0, utils_1.field)({
        type: Number,
        optional: true,
        label: 'Score',
        esType: 'number',
        default: 0
    }),
    customFieldsData: (0, utils_1.field)({
        type: [types_1.customFieldSchema],
        optional: true,
        label: 'Custom fields data'
    }),
    role: (0, utils_1.field)({
        type: String,
        label: 'User role',
        optional: true,
        default: constants_1.USER_ROLES.USER,
        enum: constants_1.USER_ROLES.ALL
    }),
    appId: (0, utils_1.field)({
        type: String,
        label: 'Linked app id',
        optional: true
    }),
    employeeId: (0, utils_1.field)({
        type: String,
        unique: true,
        optional: true,
        sparse: true
    })
}));
