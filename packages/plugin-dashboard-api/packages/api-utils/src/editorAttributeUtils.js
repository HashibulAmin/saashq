"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runReplacersOn = exports.getCustomerName = void 0;
const _ = require("lodash");
const commonUtils_1 = require("./commonUtils");
const getCustomerName = customer => {
    if (customer.firstName || customer.lastName) {
        return (customer.firstName || '') + ' ' + (customer.lastName || '');
    }
    if (customer.primaryEmail || customer.primaryPhone) {
        return customer.primaryEmail || customer.primaryPhone;
    }
    const { visitorContactInfo } = customer;
    if (visitorContactInfo) {
        return visitorContactInfo.phone || visitorContactInfo.email;
    }
    return 'Unknown';
};
exports.getCustomerName = getCustomerName;
function runReplacersOn(content, replacers = []) {
    let replacedContent = content;
    for (const replacer of replacers) {
        const regex = new RegExp(replacer.key, 'gi');
        replacedContent = replacedContent.replace(regex, replacer.value);
    }
    return replacedContent;
}
exports.runReplacersOn = runReplacersOn;
class EditorAttributeUtil {
    constructor(msgBrokerClient, API_DOMAIN, availableServices, subdomain) {
        this.msgBrokerClient = msgBrokerClient;
        this.API_DOMAIN = API_DOMAIN;
        this.availableServices = new Set(availableServices);
        this.subdomain = subdomain || 'os';
    }
    async fileToFileLink(url, name) {
        if (!url) {
            return '';
        }
        let href;
        if ((0, commonUtils_1.isValidURL)(url) || url.includes('/')) {
            href = url;
        }
        else {
            const key = url;
            const uriName = name ? encodeURIComponent(name) : url;
            href = `${this.API_DOMAIN}/read-file?key=${key}&name=${uriName}`;
        }
        return `<a target="_blank" download href="${href}">${name || url}</a>`;
    }
    async customFieldsDataItemToFileLink(customFieldDataItem) {
        const value = customFieldDataItem.value;
        if (Array.isArray(value)) {
            const links = await Promise.all(value.map(v => this.fileToFileLink(v.url, v.name)));
            return links.join(' | ');
        }
        return this.fileToFileLink(value.url, value.name);
    }
    async getPossibleCustomerFields() {
        if (!this._possibleCustomerFields) {
            this._possibleCustomerFields = await this.msgBrokerClient.sendRPCMessage('forms:fieldsCombinedByContentType', {
                data: { contentType: 'contacts:customer' },
                subdomain: this.subdomain
            });
        }
        if (!this._possibleCustomerFields) {
            throw new Error('Cannot acquire possibleCustomerFields');
        }
        return this._possibleCustomerFields || [];
    }
    async getCustomerFields(content) {
        const customerFields = ['firstName', 'lastName', 'middleName'];
        const possibleCustomerFields = await this.getPossibleCustomerFields();
        for (const field of possibleCustomerFields) {
            if (!content.includes(`{{ customer.${field.name} }}`)) {
                continue;
            }
            if (field.name.includes('trackedData')) {
                customerFields.push('trackedData');
                continue;
            }
            if (field.name.includes('customFieldsData')) {
                customerFields.push('customFieldsData');
                continue;
            }
            customerFields.push(field.name);
        }
        return customerFields;
    }
    async fillMissingCustomFieldsDataItemOfCustomer(content, customer) {
        if (!customer.customFieldsData) {
            customer.customFieldsData = [];
        }
        const existingItemsByFieldId = _.keyBy(customer.customFieldsData, 'field');
        const possibleCustomerFields = await this.getPossibleCustomerFields();
        for (const field of possibleCustomerFields) {
            if (!content.includes(`{{ customer.${field.name} }}`)) {
                continue;
            }
            if (field.name.includes('customFieldsData')) {
                const fieldId = field.name.split('.').pop();
                // if content has attribute that doesn't have fieldId, fill with dummy item
                // if content has field attribute that doesn't exist on the customer.customFieldsData, fill with dummy item
                if (!fieldId || !existingItemsByFieldId[fieldId]) {
                    customer.customFieldsData.push({
                        field: fieldId || '',
                        stringValue: '',
                        value: ''
                    });
                }
            }
        }
    }
    async generateAmounts(productsData) {
        if (!this.availableServices.has('cards')) {
            throw new Error('Cards service is not running.');
        }
        return this.msgBrokerClient.sendRPCMessage('cards:deals.generateAmounts', productsData);
    }
    async generateProducts(productsData) {
        if (!this.availableServices.has('cards')) {
            throw new Error('Cards service is not running.');
        }
        return this.msgBrokerClient.sendRPCMessage('cards:deals.generateProducts', productsData);
    }
    async generateReplacers(args) {
        const { content, user, brand, item } = args;
        const replacers = [];
        // replace customer fields
        if (args.customer) {
            const customer = args.customer;
            let customerFields = args.customerFields;
            if (!customerFields || customerFields.length === 0) {
                customerFields = await this.getCustomerFields(content);
            }
            await this.fillMissingCustomFieldsDataItemOfCustomer(content, customer);
            replacers.push({
                key: '{{ customer.name }}',
                value: (0, exports.getCustomerName)(customer)
            });
            const fields = await this.msgBrokerClient.sendRPCMessage('forms:fields.find', {
                data: {
                    query: {
                        type: 'file',
                        contentType: 'contacts:customer'
                    }
                },
                subdomain: this.subdomain
            });
            const customerFileFieldsById = _.keyBy(fields, '_id');
            for (const field of customerFields) {
                if (field.includes('trackedData') ||
                    field.includes('customFieldsData')) {
                    const dbFieldName = field.includes('trackedData')
                        ? 'trackedData'
                        : 'customFieldsData';
                    for (const customFieldsDataItem of customer[dbFieldName] || []) {
                        const replaceValue = customerFileFieldsById[customFieldsDataItem.field]
                            ? await this.customFieldsDataItemToFileLink(customFieldsDataItem)
                            : customFieldsDataItem.stringValue ||
                                customFieldsDataItem.value ||
                                '';
                        replacers.push({
                            key: `{{ customer.${dbFieldName}.${customFieldsDataItem.field} }}`,
                            value: replaceValue
                        });
                    }
                    continue;
                }
                replacers.push({
                    key: `{{ customer.${field} }}`,
                    value: customer[field] || ''
                });
            }
        }
        // replace user fields
        if (user) {
            replacers.push({ key: '{{ user.email }}', value: user.email || '' });
            if (user.details) {
                replacers.push({
                    key: '{{ user.fullName }}',
                    value: user.details.fullName || ''
                });
                replacers.push({
                    key: '{{ user.position }}',
                    value: user.details.position || ''
                });
            }
        }
        // replace brand fields
        if (brand) {
            replacers.push({ key: '{{ brandName }}', value: brand.name || '' });
        }
        // deal, ticket, task mapping
        if (item) {
            replacers.push({ key: '{{ itemName }}', value: item.name || '' });
            replacers.push({
                key: '{{ itemDescription }}',
                value: item.description || ''
            });
            replacers.push({
                key: '{{ itemCloseDate }}',
                value: item.closeDate
                    ? new Date(item.closeDate).toLocaleDateString()
                    : ''
            });
            replacers.push({
                key: '{{ itemCreatedAt }}',
                value: item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : ''
            });
            replacers.push({
                key: '{{ itemModifiedAt }}',
                value: item.modifiedAt
                    ? new Date(item.modifiedAt).toLocaleDateString()
                    : ''
            });
            const products = await this.generateProducts(item.productsData);
            const amounts = await this.generateAmounts(item.productsData);
            replacers.push({
                key: '{{ dealProducts }}',
                value: products.map(p => p.product.name).join(',')
            });
            replacers.push({
                key: '{{ dealAmounts }}',
                value: Object.keys(amounts)
                    .map(key => `${amounts[key]}${key}`)
                    .join(',')
            });
            const fieldMetaDatas = await this.msgBrokerClient.sendRPCMessage('forms:fields.find', {
                data: {
                    query: {
                        contentType: item.contentType,
                        isDefinedBySaasHQ: false
                    }
                },
                subdomain: this.subdomain
            });
            for (const fieldMetaData of fieldMetaDatas) {
                const customFieldsData = item.customFieldsData || [];
                const customFieldsDataItem = customFieldsData.find(c => c.field === fieldMetaData._id);
                const key = `{{ itemCustomField.${fieldMetaData._id} }}`;
                if (!customFieldsDataItem) {
                    if (content.includes(key)) {
                        replacers.push({
                            key,
                            value: ''
                        });
                    }
                    continue;
                }
                const replaceValue = fieldMetaData.type === 'file'
                    ? await this.customFieldsDataItemToFileLink(customFieldsDataItem)
                    : customFieldsDataItem.stringValue ||
                        customFieldsDataItem.value ||
                        '';
                replacers.push({
                    key,
                    value: replaceValue
                });
            }
        }
        return replacers;
    }
    async replaceAttributes(args) {
        const replacers = await this.generateReplacers(args);
        const replacedContent = runReplacersOn(args.content, replacers);
        return replacedContent;
    }
}
exports.default = EditorAttributeUtil;
