"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connectionResolver_1 = require("./connectionResolver");
exports.default = {
    types: [
        {
            description: 'Dashboard',
            type: 'dashboard'
        }
    ],
    tag: async ({ subdomain, data }) => {
        const { action, _ids, targetIds, tagIds } = data;
        const models = await (0, connectionResolver_1.generateModels)(subdomain);
        let response = {};
        if (action === 'count') {
            response = await models.Dashboards.countDocuments({
                tagIds: { $in: _ids }
            });
        }
        if (action === 'tagObject') {
            try {
                await models.Dashboards.updateMany({ _id: { $in: targetIds } }, { $set: { tagIds } }, { multi: true });
                response = await models.Dashboards.find({
                    _id: { $in: targetIds }
                }).lean();
            }
            catch (e) {
                console.error(e);
            }
        }
        return response;
    },
    fixRelatedItems: async ({ subdomain, data: { sourceId, destId, action } }) => {
        const models = await (0, connectionResolver_1.generateModels)(subdomain);
        if (action === 'remove') {
            await models.Dashboards.updateMany({ tagIds: { $in: [sourceId] } }, { _id: 1 });
        }
        if (action === 'merge') {
            const itemIds = await models.Dashboards.find({ tagIds: { $in: [sourceId] } }, { _id: 1 }).distinct('_id');
            // add to the new destination
            await models.Dashboards.updateMany({ _id: { $in: itemIds } }, { $set: { 'tagIds.$[elem]': destId } }, { arrayFilters: [{ elem: { $eq: sourceId } }] });
        }
    }
};
