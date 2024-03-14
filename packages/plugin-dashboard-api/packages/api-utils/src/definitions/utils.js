"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaWrapper = exports.field = void 0;
const nanoid_1 = require("nanoid");
/**
 * Mongoose field options wrapper
 */
const field = options => {
    const { pkey, type, optional } = options;
    if (type === String && !pkey && !optional) {
        options.validate = /\S+/;
    }
    if (pkey) {
        options.type = String;
        options.default = () => (0, nanoid_1.nanoid)();
    }
    return options;
};
exports.field = field;
const schemaWrapper = schema => {
    schema.add({ scopeBrandIds: [String] });
    return schema;
};
exports.schemaWrapper = schemaWrapper;
