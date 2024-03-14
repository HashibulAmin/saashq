"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchByQuery = exports.fetchEsWithScroll = exports.getIndexPrefix = exports.getMappings = exports.client = exports.fetchEs = exports.doSearch = void 0;
const elasticsearch = require("elasticsearch");
const debuggers_1 = require("./debuggers");
const doSearch = async ({ customQuery, subdomain, index, value, fields }) => {
    const highlightFields = {};
    fields.forEach(field => {
        highlightFields[field] = {};
    });
    const match = {
        multi_match: {
            query: value,
            fields
        }
    };
    let query = match;
    if (customQuery) {
        query = customQuery;
    }
    const fetchResults = await (0, exports.fetchEs)({
        subdomain,
        action: 'search',
        index,
        body: {
            query: {
                bool: {
                    must: [query]
                }
            },
            size: 10,
            highlight: {
                fields: highlightFields
            }
        },
        defaultValue: { hits: { hits: [] } }
    });
    const results = fetchResults.hits.hits.map(result => {
        return {
            source: {
                _id: result._id,
                ...result._source
            },
            highlight: result.highlight
        };
    });
    return results;
};
exports.doSearch = doSearch;
const fetchEs = async ({ action, index, body, _id, defaultValue, scroll, size, ignoreError = false }) => {
    try {
        const params = {
            index: `${(0, exports.getIndexPrefix)()}${index}`,
            body
        };
        if (action === 'search' && body && !body.size) {
            body.size = 10000;
        }
        if (_id) {
            params.id = _id;
        }
        // for returning results more than 10000
        if (scroll && size) {
            params.scroll = scroll;
            params.size = size;
        }
        const response = await exports.client[action](params);
        return response;
    }
    catch (e) {
        if (!ignoreError) {
            (0, debuggers_1.debugError)(`Error during es query: ${JSON.stringify(body)}: ${e.message}`);
        }
        if (typeof defaultValue !== 'undefined') {
            return defaultValue;
        }
        throw new Error(e);
    }
};
exports.fetchEs = fetchEs;
const { ELASTICSEARCH_URL = 'http://localhost:9200' } = process.env;
exports.client = new elasticsearch.Client({
    hosts: [ELASTICSEARCH_URL]
});
const getMappings = async (index) => {
    return exports.client.indices.getMapping({ index });
};
exports.getMappings = getMappings;
const getIndexPrefix = () => {
    return 'erxes__';
};
exports.getIndexPrefix = getIndexPrefix;
// Fetch from es with scroll option than can find results more than the default 10000
const fetchEsWithScroll = async (scrollId) => {
    try {
        const response = await exports.client.scroll({ scrollId, scroll: '1m' });
        return response;
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.fetchEsWithScroll = fetchEsWithScroll;
const fetchByQuery = async ({ subdomain, index, positiveQuery, negativeQuery, _source = '_id' }) => {
    const response = await (0, exports.fetchEs)({
        subdomain,
        action: 'search',
        index,
        body: {
            _source,
            query: {
                bool: {
                    must: positiveQuery,
                    must_not: negativeQuery
                }
            }
        },
        defaultValue: { hits: { hits: [] } }
    });
    return response.hits.hits
        .map(hit => (_source === '_id' ? hit._id : hit._source[_source]))
        .filter(r => r);
};
exports.fetchByQuery = fetchByQuery;
