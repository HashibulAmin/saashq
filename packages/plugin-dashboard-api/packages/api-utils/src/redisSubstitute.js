"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publish = exports.smembers = exports.scard = exports.sadd = exports.sismember = exports.del = exports.removeKey = exports.getArray = exports.removeFromArray = exports.addToArray = exports.inArray = exports.set = exports.get = void 0;
const storage = {};
/*
 * Get item
 */
const get = (key, defaultValue) => {
    return new Promise(resolve => {
        const value = storage[key];
        return resolve(value || defaultValue);
    });
};
exports.get = get;
/*
 * Set item
 */
const set = (key, value) => {
    storage[key] = value;
};
exports.set = set;
/*
 * Check if value exists in set
 */
const inArray = async (setKey, setMember) => {
    const value = storage[setKey];
    if (!value) {
        return false;
    }
    return value.includes(setMember);
};
exports.inArray = inArray;
/*
 * Add a value to a set or do nothing if it already exists
 */
const addToArray = (setKey, setMember) => {
    const value = storage[setKey];
    if (value) {
        value.push(setMember);
    }
};
exports.addToArray = addToArray;
/*
 * Remove a value from a set or do nothing if it is not present
 */
const removeFromArray = (setKey, setMember) => {
    const value = storage[setKey];
    if (value) {
        value.filter(m => m !== setMember);
    }
};
exports.removeFromArray = removeFromArray;
const getArray = async (key, defaultValue = []) => {
    const value = storage[key];
    if (Array.isArray(value)) {
        return value;
    }
    return defaultValue;
};
exports.getArray = getArray;
const removeKey = async (key) => {
    const selectedKey = storage[key];
    if (selectedKey) {
        delete storage[key];
    }
};
exports.removeKey = removeKey;
const del = async (key) => {
    const selectedKey = storage[key];
    if (selectedKey) {
        delete storage[key];
    }
};
exports.del = del;
const sismember = async (_channel, _action) => {
    return 1;
};
exports.sismember = sismember;
const sadd = async (_channel, _action) => {
    return 1;
};
exports.sadd = sadd;
const scard = async (_key) => {
    return 1;
};
exports.scard = scard;
const smembers = async (_key) => {
    return [];
};
exports.smembers = smembers;
const publish = async (_channel, _message) => {
    return 1;
};
exports.publish = publish;
