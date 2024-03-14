"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFileUrl = exports.isValidURL = exports.removeExtraSpaces = exports.removeLastTrailingSlash = exports.pluralFormation = exports.decryptText = exports.encryptText = exports.updateOrder = void 0;
const crypto = require("crypto");
const core_1 = require("./core");
const url_1 = require("url");
const updateOrder = async (collection, orders) => {
    if (orders.length === 0) {
        return [];
    }
    const ids = [];
    const bulkOps = [];
    for (const { _id, order } of orders) {
        ids.push(_id);
        const selector = { order };
        bulkOps.push({
            updateOne: {
                filter: { _id },
                update: selector
            }
        });
    }
    await collection.bulkWrite(bulkOps);
    return collection.find({ _id: { $in: ids } }).sort({ order: 1 });
};
exports.updateOrder = updateOrder;
const encryptText = (text) => {
    const algorithm = 'aes-256-cbc';
    // key must be 32 bytes long
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    try {
        const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
        // Update the cipher with data
        let encrypted = cipher.update(text);
        // Finalize encryption, so that no data can be written again
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        // Returning iv and encrypted data
        return {
            algorithm,
            key,
            iv: iv.toString('hex'),
            encryptedData: encrypted.toString('hex')
        };
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.encryptText = encryptText;
const decryptText = (data) => {
    const iv = Buffer.from(data.iv, 'hex');
    const encryptedText = Buffer.from(data.encryptedData, 'hex');
    const decipher = crypto.createDecipheriv(data.algorithm, Buffer.from(data.key), iv);
    // decipher
    let decrypted = decipher.update(encryptedText);
    // finalize decryption
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};
exports.decryptText = decryptText;
const pluralFormation = (type) => {
    if (type[type.length - 1] === 'y') {
        return type.slice(0, -1) + 'ies';
    }
    return type + 's';
};
exports.pluralFormation = pluralFormation;
const removeLastTrailingSlash = url => {
    if (typeof url !== 'string') {
        return url;
    }
    return url.replace(/\/$/, '');
};
exports.removeLastTrailingSlash = removeLastTrailingSlash;
const removeExtraSpaces = text => {
    if (typeof text !== 'string') {
        return;
    }
    return text.replace(/\s+/g, ' ').trim();
};
exports.removeExtraSpaces = removeExtraSpaces;
// check if valid url
const isValidURL = (url) => {
    try {
        return Boolean(new url_1.URL(url));
    }
    catch (e) {
        return false;
    }
};
exports.isValidURL = isValidURL;
const readFileUrl = (value) => {
    if (!value || (0, exports.isValidURL)(value) || value.includes('/')) {
        return value;
    }
    const DOMAIN = (0, core_1.getEnv)({
        name: 'DOMAIN'
    });
    return `${DOMAIN}/gateway/read-file?key=${value}`;
};
exports.readFileUrl = readFileUrl;
