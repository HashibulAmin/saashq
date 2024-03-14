"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("@erxes/api-utils/src");
const configs_1 = require("../../configs");
const messageBroker_1 = require("../../messageBroker");
const generateFilter = async (params, user, subdomain) => {
    const { searchValue, tag, departmentId } = params;
    let filter = {};
    if (!user.isOwner) {
        const departments = await (0, messageBroker_1.sendCoreMessage)({
            subdomain,
            action: 'departments.find',
            data: {
                userIds: { $in: [user._id] }
            },
            isRPC: true,
            defaultValue: []
        });
        const departmentIds = departments.map(d => d._id);
        filter = {
            $or: [
                { visibility: { $exists: null } },
                { visibility: 'public' },
                {
                    $and: [
                        { visibility: 'private' },
                        {
                            $or: [
                                { selectedMemberIds: user._id },
                                { createdBy: user._id },
                                { departmentIds: { $in: departmentIds } }
                            ]
                        }
                    ]
                }
            ]
        };
    }
    if (searchValue) {
        filter.name = new RegExp(`.*${searchValue}.*`, 'i');
    }
    if (tag) {
        filter.tagIds = { $in: [tag] };
    }
    if (departmentId) {
        filter.departmentIds = { $in: [departmentId] };
    }
    return filter;
};
const dashBoardQueries = {
    async dashboards(_root, params, { models, user, subdomain }) {
        const filter = await generateFilter(params, user, subdomain);
        return models.Dashboards.find(filter);
    },
    async dashboardsMain(_root, params, { models, user, subdomain }) {
        const { page, perPage } = params;
        const filter = await generateFilter(params, user, subdomain);
        const dashboards = (0, src_1.paginate)(models.Dashboards.find(filter).sort({ createdAt: -1 }), { perPage, page });
        const totalCount = await models.Dashboards.find(filter).countDocuments();
        return {
            list: dashboards,
            totalCount
        };
    },
    dashboardDetails(_root, { _id }, { models }) {
        return models.Dashboards.findOne({ _id });
    },
    dashboardsTotalCount(_root, args, { models }) {
        return models.Dashboards.find({}).countDocuments();
    },
    async dashboardGetTypes() {
        var _a;
        const services = await configs_1.serviceDiscovery.getServices();
        let dashboardTypes = [];
        for (const serviceName of services) {
            const service = await configs_1.serviceDiscovery.getService(serviceName, true);
            const meta = ((_a = service.config) === null || _a === void 0 ? void 0 : _a.meta) || {};
            if (meta && meta.dashboards) {
                const types = meta.dashboards.types || [];
                dashboardTypes = [...dashboardTypes, ...types];
            }
        }
        return [
            'Customers',
            'Deals',
            'Conversations',
            'Tasks',
            'Tickets',
            'Purchases'
        ];
    },
    async dashboardCountByTags(_root, _params, { models, subdomain }) {
        const counts = {};
        const tags = await (0, messageBroker_1.sendTagsMessage)({
            subdomain,
            action: 'find',
            data: {
                type: 'dashboard:dashboard'
            },
            isRPC: true,
            defaultValue: []
        });
        for (const tag of tags) {
            counts[tag._id] = await models.Dashboards.find({
                tagIds: tag._id,
                status: { $ne: 'deleted' }
            }).countDocuments();
        }
        return counts;
    },
    async dashboardItems(_root, { dashboardId }, { models }) {
        return models.DashboardItems.find({ dashboardId });
    },
    dashboardItemDetail(_root, { _id }, { models }) {
        return models.DashboardItems.findOne({ _id });
    }
};
exports.default = dashBoardQueries;
