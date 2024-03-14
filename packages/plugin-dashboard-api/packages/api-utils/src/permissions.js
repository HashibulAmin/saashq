"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleCheckPermission = exports.moduleRequireLogin = exports.requireLogin = exports.checkPermission = exports.getUserAllowedActions = exports.can = exports.getUserActionsMap = exports.permissionWrapper = exports.getKey = exports.checkLogin = void 0;
const core_1 = require("./core");
const messageBroker_1 = require("./messageBroker");
const redis_1 = require("./redis");
const checkLogin = (user) => {
    if (!user || !user._id) {
        throw new Error('Login required');
    }
};
exports.checkLogin = checkLogin;
const getKey = (user) => `user_permissions_${user._id}`;
exports.getKey = getKey;
const resolverWrapper = async (methodName, args, context) => {
    const value = await redis_1.default.get('beforeResolvers');
    const beforeResolvers = JSON.parse(value || '{}');
    let results = {};
    if (beforeResolvers[methodName] && beforeResolvers[methodName].length) {
        for (const service of beforeResolvers[methodName]) {
            results = {
                ...results,
                ...(await (0, messageBroker_1.sendRPCMessage)(`${service}:beforeResolver`, {
                    subdomain: context.subdomain,
                    data: {
                        resolver: methodName,
                        args
                    }
                }))
            };
        }
    }
    return { ...args, ...results };
};
const permissionWrapper = (cls, methodName, checkers) => {
    const oldMethod = cls[methodName];
    cls[methodName] = async (root, args, context, info) => {
        const { user } = context;
        for (const checker of checkers) {
            checker(user);
        }
        args = await resolverWrapper(methodName, args, context);
        return oldMethod(root, args, context, info);
    };
};
exports.permissionWrapper = permissionWrapper;
const getUserActionsMap = async (subdomain, user, permissionsFind) => {
    const key = (0, exports.getKey)(user);
    const permissionCache = await redis_1.default.get(key);
    let actionMap;
    if (permissionCache && permissionCache !== '{}') {
        actionMap = JSON.parse(permissionCache);
    }
    else {
        const userPermissionQuery = {
            userId: user._id
        };
        const userPermissions = await (permissionsFind
            ? permissionsFind(userPermissionQuery)
            : (0, messageBroker_1.sendRPCMessage)('core:permissions.find', {
                subdomain,
                data: userPermissionQuery
            }));
        const groupPermissionQuery = {
            groupId: { $in: user.groupIds }
        };
        const groupPermissions = await (permissionsFind
            ? permissionsFind(groupPermissionQuery)
            : (0, messageBroker_1.sendRPCMessage)('core:permissions.find', {
                subdomain,
                data: groupPermissionQuery
            }));
        actionMap = await (0, core_1.userActionsMap)(userPermissions, groupPermissions, user);
        redis_1.default.set(key, JSON.stringify(actionMap));
    }
    return actionMap;
};
exports.getUserActionsMap = getUserActionsMap;
const can = async (subdomain, action, user) => {
    if (!user || !user._id) {
        return false;
    }
    if (user.isOwner) {
        return true;
    }
    const actionMap = await (0, exports.getUserActionsMap)(subdomain, user);
    if (!actionMap) {
        return false;
    }
    return actionMap[action] === true;
};
exports.can = can;
/*
 * Get allowed actions
 */
const getUserAllowedActions = async (subdomain, user) => {
    const map = await (0, exports.getUserActionsMap)(subdomain, user);
    const allowedActions = [];
    for (const key of Object.keys(map)) {
        if (map[key]) {
            allowedActions.push(key);
        }
    }
    return allowedActions;
};
exports.getUserAllowedActions = getUserAllowedActions;
const checkPermission = async (cls, methodName, actionName, defaultValue) => {
    const oldMethod = cls[methodName];
    cls[methodName] = async (root, args, context, info) => {
        const { user, subdomain } = context;
        (0, exports.checkLogin)(user);
        const allowed = await (0, exports.can)(subdomain, actionName, user);
        if (!allowed) {
            if (defaultValue) {
                return defaultValue;
            }
            throw new Error('Permission required');
        }
        args = await resolverWrapper(methodName, args, context);
        return oldMethod(root, args, context, info);
    };
};
exports.checkPermission = checkPermission;
const requireLogin = (cls, methodName) => (0, exports.permissionWrapper)(cls, methodName, [exports.checkLogin]);
exports.requireLogin = requireLogin;
const moduleRequireLogin = (mdl) => {
    for (const method in mdl) {
        if (mdl.hasOwnProperty(method)) {
            (0, exports.requireLogin)(mdl, method);
        }
    }
};
exports.moduleRequireLogin = moduleRequireLogin;
/**
 * Wraps all properties (methods) of a given object with 'Permission action required' permission checker
 */
const moduleCheckPermission = async (mdl, action, defaultValue) => {
    for (const method in mdl) {
        if (mdl.hasOwnProperty(method)) {
            await (0, exports.checkPermission)(mdl, method, action, defaultValue);
        }
    }
};
exports.moduleCheckPermission = moduleCheckPermission;
