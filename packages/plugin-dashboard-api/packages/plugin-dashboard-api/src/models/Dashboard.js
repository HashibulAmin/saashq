"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDashboardItemClass = exports.loadDashboardClass = void 0;
const _ = require("underscore");
const dashboard_1 = require("./definitions/dashboard");
const utils_1 = require("./definitions/utils");
const setRelatedIds = async (dashboard, models) => {
    if (dashboard.parentId) {
        const parentDashboard = await models.Dashboards.findOne({
            _id: dashboard.parentId
        });
        if (parentDashboard) {
            let relatedIds;
            relatedIds = dashboard.relatedIds || [];
            relatedIds.push(dashboard._id);
            relatedIds = _.union(relatedIds, parentDashboard.relatedIds || []);
            await models.Dashboards.updateOne({ _id: parentDashboard._id }, { $set: { relatedIds } });
            const updated = await models.Dashboards.findOne({
                _id: dashboard.parentId
            });
            if (updated) {
                await setRelatedIds(updated, models);
            }
        }
    }
};
// remove related dashboards
const removeRelatedIds = async (dashboard, models) => {
    const dashboards = await models.Dashboards.find({
        relatedIds: { $in: dashboard._id }
    });
    if (dashboards.length === 0) {
        return;
    }
    const relatedIds = dashboard.relatedIds || [];
    relatedIds.push(dashboard._id);
    const doc = [];
    dashboards.forEach(async (t) => {
        const ids = (t.relatedIds || []).filter(id => !relatedIds.includes(id));
        doc.push({
            updateOne: {
                filter: { _id: t._id },
                update: { $set: { relatedIds: ids } }
            }
        });
    });
    await models.Dashboards.bulkWrite(doc);
};
const loadDashboardClass = (models) => {
    class Dashboard {
        static async getDashboard(_id) {
            const dashboard = await models.Dashboards.findOne({ _id });
            if (!dashboard) {
                throw new Error('Dashboard not found');
            }
            return dashboard;
        }
        static async validateUniqueness(selector, name) {
            // required name
            if (!name) {
                return true;
            }
            // can't update name same time more than one dashboards.
            const count = await models.Dashboards.find(selector).countDocuments();
            if (selector && count > 1) {
                return false;
            }
            const obj = selector && (await models.Dashboards.findOne(selector));
            const filter = { name };
            if (obj) {
                filter._id = { $ne: obj._id };
            }
            const existing = await models.Dashboards.findOne(filter);
            if (existing) {
                return false;
            }
            return true;
        }
        static async getParentDashboard(doc) {
            return models.Dashboards.findOne({
                _id: doc.parentId
            }).lean();
        }
        static async generateOrder(parentDashboard, { name }) {
            const order = `${name}`;
            if (!parentDashboard) {
                return order;
            }
            let parentOrder = parentDashboard.order;
            if (!parentOrder) {
                parentOrder = `${parentDashboard.name}`;
                await models.Dashboards.updateOne({
                    _id: parentDashboard._id
                }, { $set: { order: parentOrder } });
            }
            return `${parentOrder}/${order}`;
        }
        static async addDashboard(doc) {
            const isUnique = await models.Dashboards.validateUniqueness(null, doc.name);
            if (!isUnique) {
                throw new Error('Dashboard duplicated');
            }
            const parentDashboard = await this.getParentDashboard(doc);
            // Generating order
            const order = await this.generateOrder(parentDashboard, doc);
            const dashboard = await models.Dashboards.create({
                ...doc,
                order,
                createdAt: new Date()
            });
            await setRelatedIds(dashboard, models);
            return dashboard;
        }
        static async editDashboard(_id, doc, user) {
            const isUnique = await models.Dashboards.validateUniqueness({ _id }, doc.name);
            if (!isUnique) {
                throw new Error('Dashboard duplicated');
            }
            const parentDashboard = await this.getParentDashboard(doc);
            if (parentDashboard && parentDashboard.parentId === _id) {
                throw new Error('Cannot change dashboard');
            }
            // Generating  order
            const order = await this.generateOrder(parentDashboard, doc);
            const dashboard = await models.Dashboards.findOne({
                _id
            });
            if (dashboard && dashboard.order) {
                const childDashboards = await models.Dashboards.find({
                    $and: [
                        {
                            order: { $regex: new RegExp((0, utils_1.escapeRegExp)(dashboard.order), 'i') }
                        },
                        { _id: { $ne: _id } }
                    ]
                });
                if (childDashboards.length > 0) {
                    const bulkDoc = [];
                    // updating child categories order
                    childDashboards.forEach(async (childDashboard) => {
                        let childOrder = childDashboard.order;
                        if (dashboard.order && childOrder) {
                            childOrder = childOrder.replace(dashboard.order, order);
                            bulkDoc.push({
                                updateOne: {
                                    filter: { _id: childDashboard._id },
                                    update: { $set: { order: childOrder } }
                                }
                            });
                        }
                    });
                    await models.Dashboards.bulkWrite(bulkDoc);
                    await removeRelatedIds(dashboard, models);
                }
            }
            await models.Dashboards.updateOne({ _id }, { $set: { ...doc, order, updatedAt: new Date(), updatedBy: user._id } });
            const updated = await models.Dashboards.findOne({ _id });
            if (updated) {
                await setRelatedIds(updated, models);
            }
            return updated;
        }
        static async removeDashboard(_id) {
            const dashboard = await models.Dashboards.getDashboard(_id);
            const childCount = await models.Dashboards.countDocuments({
                parentId: _id
            });
            if (childCount > 0) {
                throw new Error('Please remove child dashboards first');
            }
            await removeRelatedIds(dashboard, models);
            return models.Dashboards.deleteOne({ _id });
        }
    }
    dashboard_1.dashboardSchema.loadClass(Dashboard);
    return dashboard_1.dashboardSchema;
};
exports.loadDashboardClass = loadDashboardClass;
const loadDashboardItemClass = (models) => {
    class DashboardItem {
        static addDashboardItem(doc) {
            return models.DashboardItems.create(doc);
        }
        static async editDashboardItem(_id, feilds) {
            await models.DashboardItems.updateOne({ _id }, { $set: feilds });
            return models.DashboardItems.findOne({ _id });
        }
        static async removeDashboardItem(_id) {
            await models.DashboardItems.deleteOne({ _id });
        }
    }
    dashboard_1.dashboardItemSchema.loadClass(DashboardItem);
    return dashboard_1.dashboardItemSchema;
};
exports.loadDashboardItemClass = loadDashboardItemClass;
