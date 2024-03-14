"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setProperty = exports.OPERATORS = exports.replacePlaceHolders = void 0;
const moment = require("moment");
const commonUtils_1 = require("./commonUtils");
const replacePlaceHolders = async ({ models, subdomain, actionData, target, isRelated = true, getRelatedValue, relatedValueProps, complexFields }) => {
    var _a;
    if (actionData) {
        const targetKeys = Object.keys(target);
        const actionDataKeys = Object.keys(actionData);
        for (const actionDataKey of actionDataKeys) {
            for (const targetKey of targetKeys) {
                if (actionData[actionDataKey].includes(`{{ ${targetKey} }}`)) {
                    const replaceValue = (isRelated &&
                        (await getRelatedValue(models, subdomain, target, targetKey, relatedValueProps))) ||
                        target[targetKey];
                    actionData[actionDataKey] = actionData[actionDataKey].replace(`{{ ${targetKey} }}`, replaceValue);
                }
                // some text {{now+3d }} some text
                const nowRegex = new RegExp(/{{ now\+(\d+)d }}/g);
                const regexResult = nowRegex.exec(actionData[actionDataKey]);
                if (regexResult && regexResult.length === 2) {
                    const dayValue = regexResult[1];
                    actionData[actionDataKey] = moment()
                        .add(dayValue, 'day')
                        .toDate()
                        .toString();
                }
                if (actionData[actionDataKey].includes(`{{ now }}`)) {
                    actionData[actionDataKey] = actionData[actionDataKey].replace(`{{ now }}`, new Date());
                }
                if (actionData[actionDataKey].includes(`{{ tomorrow }}`)) {
                    const today = new Date();
                    const tomorrow = today.setDate(today.getDate() + 1);
                    actionData[actionDataKey] = actionData[actionDataKey].replace(`{{ tomorrow }}`, tomorrow);
                }
                if (actionData[actionDataKey].includes(`{{ nextWeek }}`)) {
                    const today = new Date();
                    const nextWeek = today.setDate(today.getDate() + 7);
                    actionData[actionDataKey] = actionData[actionDataKey].replace(`{{ nextWeek }}`, nextWeek);
                }
                if (actionData[actionDataKey].includes(`{{ nextMonth }}`)) {
                    const today = new Date();
                    const nextMonth = today.setDate(today.getDate() + 30);
                    actionData[actionDataKey] = actionData[actionDataKey].replace(`{{ nextMonth }}`, nextMonth);
                }
                for (const complexFieldKey of [
                    'customFieldsData',
                    'trackedData'
                ].concat(complexFields || [])) {
                    if (actionData[actionDataKey].includes(complexFieldKey)) {
                        const regex = new RegExp(`{{ ${complexFieldKey}.([\\w\\d]+) }}`);
                        const match = regex.exec(actionData[actionDataKey]);
                        const fieldId = match && match.length === 2 ? match[1] : '';
                        if ((_a = (complexFields || [])) === null || _a === void 0 ? void 0 : _a.includes(complexFieldKey)) {
                            const replaceValue = (await getRelatedValue(models, subdomain, target, `${complexFieldKey}.${fieldId}`, relatedValueProps)) || target[targetKey];
                            actionData[actionDataKey] = actionData[actionDataKey].replace(`{{ ${complexFieldKey}.${fieldId} }}`, replaceValue);
                        }
                        else {
                            const complexFieldData = target[complexFieldKey].find(cfd => cfd.field === fieldId);
                            actionData[actionDataKey] = actionData[actionDataKey].replace(`{{ ${complexFieldKey}.${fieldId} }}`, complexFieldData ? complexFieldData.value : '');
                        }
                    }
                }
            }
            actionData[actionDataKey] = actionData[actionDataKey]
                .replace(/\[\[ /g, '')
                .replace(/ \]\]/g, '');
        }
    }
    return actionData;
};
exports.replacePlaceHolders = replacePlaceHolders;
exports.OPERATORS = {
    SET: 'set',
    CONCAT: 'concat',
    ADD: 'add',
    SUBTRACT: 'subtract',
    MULTIPLY: 'multiply',
    DIVIDE: 'divide',
    PERCENT: 'percent',
    ALL: ['set', 'concat', 'add', 'subtract', 'multiply', 'divide', 'percent']
};
const convertOp1 = (relatedItem, field) => {
    var _a;
    if (['customFieldsData', 'trackedData'].some(complexField => field.includes(complexField))) {
        const [complexFieldKey, nestedComplexFieldKey] = field.split('.');
        return (_a = (relatedItem[complexFieldKey] || []).find(nestedObj => nestedObj.field === nestedComplexFieldKey)) === null || _a === void 0 ? void 0 : _a.value;
    }
    return relatedItem[field];
};
const getPerValue = async (args) => {
    var _a;
    const { models, subdomain, relatedItem, rule, target, getRelatedValue, serviceName, triggerType, sendCommonMessage } = args;
    let { field, operator, value } = rule;
    const op1Type = typeof convertOp1(relatedItem, field);
    // replace placeholder if value has attributes from related service
    if (value.match(/\{\{\s*([^}]+)\s*\}\}/g) &&
        !(triggerType || '').includes(serviceName)) {
        const [relatedServiceName] = triggerType.split(':');
        value =
            ((_a = (await sendCommonMessage({
                serviceName: relatedServiceName,
                subdomain,
                action: 'automations.replacePlaceHolders',
                data: {
                    target,
                    config: { value }
                },
                isRPC: true,
                defaultValue: {}
            }))) === null || _a === void 0 ? void 0 : _a.value) || value;
    }
    let op1 = convertOp1(relatedItem, field);
    let updatedValue = (await (0, exports.replacePlaceHolders)({
        models,
        subdomain,
        getRelatedValue,
        actionData: { config: value },
        target,
        isRelated: op1Type === 'string' ? true : false
    })).config;
    if (field.includes('Ids')) {
        //
        const set = [
            new Set((updatedValue || '')
                .trim()
                .replace(/, /g, ',')
                .split(',') || [])
        ];
        updatedValue = [...set];
    }
    if ([
        exports.OPERATORS.ADD,
        exports.OPERATORS.SUBTRACT,
        exports.OPERATORS.MULTIPLY,
        exports.OPERATORS.DIVIDE,
        exports.OPERATORS.PERCENT
    ].includes(operator)) {
        op1 = op1 || 0;
        const numberValue = parseInt(value, 10);
        switch (operator) {
            case exports.OPERATORS.ADD:
                updatedValue = op1 + numberValue;
                break;
            case exports.OPERATORS.SUBTRACT:
                updatedValue = op1 - numberValue;
                break;
            case exports.OPERATORS.MULTIPLY:
                updatedValue = op1 * numberValue;
                break;
            case exports.OPERATORS.DIVIDE:
                updatedValue = op1 / numberValue || 1;
                break;
            case exports.OPERATORS.PERCENT:
                updatedValue = (op1 / 100) * numberValue;
                break;
        }
    }
    if (operator === 'concat') {
        updatedValue = (op1 || '').concat(updatedValue);
    }
    if (['addDay', 'subtractDay'].includes(operator)) {
        op1 = op1 || new Date();
        try {
            op1 = new Date(op1);
        }
        catch (e) {
            op1 = new Date();
        }
        updatedValue =
            operator === 'addDay'
                ? parseFloat(updatedValue)
                : -1 * parseFloat(updatedValue);
        updatedValue = new Date(op1.setDate(op1.getDate() + updatedValue));
    }
    return updatedValue;
};
const setProperty = async ({ models, subdomain, module, rules, execution, getRelatedValue, relatedItems, sendCommonMessage, triggerType }) => {
    const { target } = execution;
    const [serviceName, collectionType] = module.split(':');
    const result = [];
    for (const relatedItem of relatedItems) {
        const setDoc = {};
        const pushDoc = {};
        const selectorDoc = {};
        const servicesToForward = [];
        for (const rule of rules) {
            const value = await getPerValue({
                models,
                subdomain,
                relatedItem,
                rule,
                target,
                getRelatedValue,
                triggerType,
                serviceName,
                sendCommonMessage
            });
            if (rule.forwardTo) {
                servicesToForward.push(rule.forwardTo);
            }
            if (!rule.field.includes('customFieldsData') &&
                !rule.field.includes('trackedData')) {
                setDoc[rule.field] = value;
                continue;
            }
            for (const complexFieldKey of ['customFieldsData', 'trackedData']) {
                if (rule.field.includes(complexFieldKey)) {
                    const fieldId = rule.field.replace(`${complexFieldKey}.`, '');
                    const complexFieldData = await sendCommonMessage({
                        subdomain,
                        serviceName: 'forms',
                        action: 'fields.generateTypedItem',
                        data: {
                            field: fieldId,
                            value
                        },
                        isRPC: true
                    });
                    if ((relatedItem[complexFieldKey] || []).find(obj => obj.field === fieldId)) {
                        selectorDoc[`${complexFieldKey}.field`] = fieldId;
                        const complexFieldDataKeys = Object.keys(complexFieldData).filter(key => key !== 'field');
                        for (const complexFieldDataKey of complexFieldDataKeys) {
                            setDoc[`${complexFieldKey}.$.${complexFieldDataKey}`] =
                                complexFieldData[complexFieldDataKey];
                        }
                    }
                    else {
                        pushDoc[complexFieldKey] = complexFieldData;
                    }
                }
            }
        }
        const modifier = {};
        if (Object.keys(setDoc).length > 0) {
            modifier.$set = setDoc;
        }
        if (Object.keys(pushDoc).length > 0) {
            modifier.$push = pushDoc;
        }
        const response = await sendCommonMessage({
            subdomain,
            serviceName,
            action: `${(0, commonUtils_1.pluralFormation)(collectionType)}.updateMany`,
            data: { selector: { _id: relatedItem._id, ...selectorDoc }, modifier },
            isRPC: true
        });
        for (const service of servicesToForward) {
            await sendCommonMessage({
                subdomain,
                serviceName: service,
                action: 'automations.receiveSetPropertyForwardTo',
                data: {
                    target,
                    collectionType,
                    setDoc,
                    pushDoc
                }
            });
        }
        if (response.error) {
            result.push(response);
            continue;
        }
        result.push({
            _id: relatedItem._id,
            rules: Object
                .values(setDoc)
                .map(v => String(v))
                .join(', ')
        });
    }
    return { module, fields: rules.map(r => r.field).join(', '), result };
};
exports.setProperty = setProperty;
