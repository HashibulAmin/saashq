"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortStrToDate = exports.dateToShortStr = exports.stripHtml = exports.authCookieOptions = exports.createGenerateModels = exports.getSubdomain = exports.generateAttachmentUrl = exports.userActionsMap = exports.sendMessage = exports.escapeRegExp = exports.getUniqueValue = exports.splitStr = exports.cleanHtml = exports.chunkArray = exports.checkUserIds = exports.getNextMonth = exports.getTomorrow = exports.getPureDate = exports.getToday = exports.getDate = exports.fixDate = exports.regexSearchText = exports.validSearchText = exports.paginate = exports.getUserDetail = exports.getEnv = void 0;
const mongoose = require("mongoose");
const strip = require("strip");
const random_1 = require("@saashq/api-utils/src/random");
const getEnv = ({ name, defaultValue }) => {
    const value = process.env[name];
    if (!value && typeof defaultValue !== 'undefined') {
        return defaultValue;
    }
    return value || '';
};
exports.getEnv = getEnv;
/**
 * Returns user's name  or email
 */
const getUserDetail = (user) => {
    if (user.details) {
        return `${user.details.firstName} ${user.details.lastName}`;
    }
    return user.email;
};
exports.getUserDetail = getUserDetail;
const paginate = (collection, params) => {
    const { page = 0, perPage = 0, ids, excludeIds } = params || { ids: null };
    const _page = Number(page || '1');
    const _limit = Number(perPage || '20');
    if (ids && ids.length > 0) {
        return excludeIds ? collection.limit(_limit) : collection;
    }
    return collection.limit(_limit).skip((_page - 1) * _limit);
};
exports.paginate = paginate;
const validSearchText = (values) => {
    const value = values.join(' ');
    if (value.length < 512) {
        return value;
    }
    return value.substring(0, 511);
};
exports.validSearchText = validSearchText;
const stringToRegex = (value) => {
    const specialChars = '{}[]\\^$.|?*+()'.split('');
    const val = value.split('');
    const result = val.map(char => specialChars.includes(char) ? '.?\\' + char : '.?' + char);
    return '.*' + result.join('').substring(2) + '.*';
};
const regexSearchText = (searchValue, searchKey = 'searchText') => {
    const result = [];
    searchValue = searchValue.replace(/\s\s+/g, ' ');
    const words = searchValue.split(' ');
    for (const word of words) {
        result.push({
            [searchKey]: { $regex: `${stringToRegex(word)}`, $options: 'mui' }
        });
    }
    return { $and: result };
};
exports.regexSearchText = regexSearchText;
/*
 * Converts given value to date or if value in valid date
 * then returns default value
 */
const fixDate = (value, defaultValue = new Date()) => {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
        return date;
    }
    return defaultValue;
};
exports.fixDate = fixDate;
const getDate = (date, day) => {
    const currentDate = new Date();
    date.setDate(currentDate.getDate() + day + 1);
    date.setHours(0, 0, 0, 0);
    return date;
};
exports.getDate = getDate;
const getToday = (date) => {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
};
exports.getToday = getToday;
const getPureDate = (date, multiplier = 1) => {
    const ndate = new Date(date);
    const diffTimeZone = multiplier * Number(process.env.TIMEZONE || 0) * 1000 * 60 * 60;
    return new Date(ndate.getTime() - diffTimeZone);
};
exports.getPureDate = getPureDate;
const getTomorrow = (date) => {
    return (0, exports.getToday)(new Date(date.getTime() + 24 * 60 * 60 * 1000));
};
exports.getTomorrow = getTomorrow;
const getNextMonth = (date) => {
    const today = (0, exports.getToday)(date);
    const currentMonth = new Date().getMonth();
    if (currentMonth === 11) {
        today.setFullYear(today.getFullYear() + 1);
    }
    const month = (currentMonth + 1) % 12;
    const start = today.setMonth(month, 1);
    const end = today.setMonth(month + 1, 0);
    return { start, end };
};
exports.getNextMonth = getNextMonth;
/**
 * Check user ids whether its added or removed from array of ids
 */
const checkUserIds = (oldUserIds = [], newUserIds = []) => {
    const removedUserIds = oldUserIds.filter(e => !newUserIds.includes(e));
    const addedUserIds = newUserIds.filter(e => !oldUserIds.includes(e));
    return { addedUserIds, removedUserIds };
};
exports.checkUserIds = checkUserIds;
const chunkArray = (myArray, chunkSize) => {
    let index = 0;
    const arrayLength = myArray.length;
    const tempArray = [];
    for (index = 0; index < arrayLength; index += chunkSize) {
        const myChunk = myArray.slice(index, index + chunkSize);
        // Do something if you want with the group
        tempArray.push(myChunk);
    }
    return tempArray;
};
exports.chunkArray = chunkArray;
const cleanHtml = (content) => strip(content || '').substring(0, 100);
exports.cleanHtml = cleanHtml;
/**
 * Splits text into chunks of strings limited by given character count
 * .{1,100}(\s|$)
 * . - matches any character (except for line terminators)
 * {1,100} - matches the previous token between 1 and 100 times, as many times as possible, giving back as needed (greedy)
 * (\s|$) - capturing group
 * \s - matches any whitespace character
 * $ - asserts position at the end of the string
 *
 * @param str text to be split
 * @param size character length of each chunk
 */
const splitStr = (str, size) => {
    const cleanStr = strip(str);
    return cleanStr.match(new RegExp(new RegExp(`.{1,${size}}(\s|$)`, 'g')));
};
exports.splitStr = splitStr;
const generateRandomEmail = () => {
    let chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let string = '';
    for (let ii = 0; ii < 15; ii++) {
        string += chars[Math.floor(Math.random() * chars.length)];
    }
    return string + '@gmail.com';
};
const getUniqueValue = async (collection, fieldName = 'code', defaultValue) => {
    const getRandomValue = (type) => type === 'email' ? generateRandomEmail() : (0, random_1.randomAlphanumeric)();
    let uniqueValue = defaultValue || getRandomValue(fieldName);
    let duplicated = await collection.findOne({ [fieldName]: uniqueValue });
    while (duplicated) {
        uniqueValue = getRandomValue(fieldName);
        duplicated = await collection.findOne({ [fieldName]: uniqueValue });
    }
    return uniqueValue;
};
exports.getUniqueValue = getUniqueValue;
const escapeRegExp = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
exports.escapeRegExp = escapeRegExp;
const sendMessage = async (args) => {
    const { client, serviceDiscovery, serviceName, subdomain, action, data, defaultValue, isRPC, isMQ, timeout } = args;
    if (serviceName) {
        if (!(await serviceDiscovery.isEnabled(serviceName))) {
            return defaultValue;
        }
        if (isRPC && !(await serviceDiscovery.isAvailable(serviceName))) {
            if (process.env.NODE_ENV === 'development') {
                throw new Error(`${serviceName} service is not available`);
            }
            else {
                return defaultValue;
            }
        }
    }
    const queueName = serviceName + (serviceName ? ':' : '') + action;
    if (!client) {
        throw new Error(`client not found during ${queueName}`);
    }
    return client[isRPC ? (isMQ ? 'sendRPCMessageMq' : 'sendRPCMessage') : 'sendMessage'](queueName, {
        subdomain,
        data,
        defaultValue,
        timeout,
        thirdService: data && data.thirdService
    });
};
exports.sendMessage = sendMessage;
const userActionsMap = async (userPermissions, groupPermissions, user) => {
    const totalPermissions = [
        ...userPermissions,
        ...groupPermissions,
        ...(user.customPermissions || [])
    ];
    const allowedActions = {};
    const check = (name, allowed) => {
        if (typeof allowedActions[name] === 'undefined') {
            allowedActions[name] = allowed;
        }
        // if a specific permission is denied elsewhere, follow that rule
        if (allowedActions[name] && !allowed) {
            allowedActions[name] = false;
        }
    };
    for (const { requiredActions, allowed, action } of totalPermissions) {
        if (requiredActions.length > 0) {
            for (const actionName of requiredActions) {
                check(actionName, allowed);
            }
        }
        else {
            check(action, allowed);
        }
    }
    return allowedActions;
};
exports.userActionsMap = userActionsMap;
/*
 * Generate url depending on given file upload publicly or not
 */
const generateAttachmentUrl = (urlOrName) => {
    const DOMAIN = (0, exports.getEnv)({ name: 'DOMAIN' });
    if (urlOrName.startsWith('http')) {
        return urlOrName;
    }
    return `${DOMAIN}/gateway/pl:core/read-file?key=${urlOrName}`;
};
exports.generateAttachmentUrl = generateAttachmentUrl;
const getSubdomain = (req) => {
    const hostname = req.headers.hostname || req.hostname;
    return hostname.replace(/(^\w+:|^)\/\//, '').split('.')[0];
};
exports.getSubdomain = getSubdomain;
const connectionOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    family: 4
};
const createGenerateModels = (models, loadClasses) => {
    return async (hostnameOrSubdomain) => {
        if (models) {
            return models;
        }
        const MONGO_URL = (0, exports.getEnv)({ name: 'MONGO_URL' });
        const db = await mongoose.connect(MONGO_URL, connectionOptions);
        models = loadClasses(db, hostnameOrSubdomain);
        return models;
    };
};
exports.createGenerateModels = createGenerateModels;
const authCookieOptions = (options = {}) => {
    const NODE_ENV = (0, exports.getEnv)({ name: 'NODE_ENV' });
    const maxAge = options.expires || 14 * 24 * 60 * 60 * 1000;
    const secure = !['test', 'development'].includes(NODE_ENV);
    if (!secure && options.sameSite) {
        delete options.sameSite;
    }
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + maxAge),
        maxAge,
        secure,
        ...options
    };
    return cookieOptions;
};
exports.authCookieOptions = authCookieOptions;
const stripHtml = (string) => {
    if (typeof string === 'undefined' || string === null) {
        return;
    }
    else {
        const regex = /(&nbsp;|<([^>]+)>)/gi;
        let result = string.replace(regex, '');
        result = result.replace(/&#[0-9][0-9][0-9][0-9];/gi, ' ');
        const cut = result.slice(0, 70);
        return cut;
    }
};
exports.stripHtml = stripHtml;
const DATE_OPTIONS = {
    d: 1000 * 60 * 60 * 24,
    h: 1000 * 60 * 60,
    m: 1000 * 60,
    s: 1000,
    ms: 1
};
const CHARACTERS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@#$%^&*()-=+{}[]<>.,:;"`|/?';
const BEGIN_DIFF = 1577836800000; // new Date('2020-01-01').getTime();
const dateToShortStr = (date, scale, kind) => {
    date = new Date(date || new Date());
    if (!scale) {
        scale = 62;
    }
    if (!kind) {
        kind = 'd';
    }
    const divider = DATE_OPTIONS[kind];
    const chars = CHARACTERS.substring(0, scale);
    let intgr = Math.round((date.getTime() - BEGIN_DIFF) / divider);
    let short = '';
    while (intgr > 0) {
        const preInt = intgr;
        intgr = Math.floor(intgr / scale);
        const strInd = preInt - intgr * scale;
        short = `${chars[strInd]}${short}`;
    }
    return short;
};
exports.dateToShortStr = dateToShortStr;
const shortStrToDate = (shortStr, scale, kind, resultType) => {
    if (!shortStr)
        return;
    if (!scale) {
        scale = 62;
    }
    if (!kind) {
        kind = 'd';
    }
    const chars = CHARACTERS.substring(0, scale);
    const multiplier = DATE_OPTIONS[kind];
    let intgr = 0;
    let scaler = 1;
    for (let i = shortStr.length; i--; i >= 0) {
        const char = shortStr[i];
        intgr = intgr + scaler * chars.indexOf(char);
        scaler = scaler * scale;
    }
    intgr = intgr * multiplier + BEGIN_DIFF;
    if (resultType === 'd')
        return new Date(intgr);
    return intgr;
};
exports.shortStrToDate = shortStrToDate;
