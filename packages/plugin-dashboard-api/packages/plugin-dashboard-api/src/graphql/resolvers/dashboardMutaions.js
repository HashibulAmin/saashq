"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashboardsMutations = {
    async dashboardsAdd(_root, doc, { docModifier, models, user }) {
        const dashboard = await models.Dashboards.create({
            ...docModifier(doc),
            createdAt: new Date(),
            createdBy: user._id,
            updatedBy: user._id
        });
        return dashboard;
    },
    async dashboardsEdit(_root, { _id, ...fields }, { models, user }) {
        return models.Dashboards.editDashboard(_id, fields, user);
    },
    async dashboardsRemove(_root, { dashboardIds }, { models }) {
        await models.DashboardItems.deleteMany({
            dashboardId: { $in: dashboardIds }
        });
        return models.Dashboards.deleteMany({ _id: { $in: dashboardIds } });
    },
    async dashboardItemsAdd(_root, doc, { models }) {
        const dashboardItem = await models.DashboardItems.addDashboardItem({
            ...doc
        });
        return dashboardItem;
    },
    async dashboardItemsEdit(_root, { _id, ...fields }, { models }) {
        return models.DashboardItems.editDashboardItem(_id, fields);
    },
    async dashboardItemsRemove(_root, { _id }, { models }) {
        return models.DashboardItems.removeDashboardItem(_id);
    }
};
exports.default = dashboardsMutations;
