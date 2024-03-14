"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messageBroker_1 = require("../../messageBroker");
exports.default = {
    createdUser(dashboard) {
        return (dashboard.createdBy && {
            __typename: 'User',
            _id: dashboard.createdBy
        });
    },
    updatedUser(dashboard) {
        return (dashboard.updatedBy && {
            __typename: 'User',
            _id: dashboard.updatedBy
        });
    },
    async getTags(dashboard, _, { subdomain }) {
        return (0, messageBroker_1.sendTagsMessage)({
            subdomain,
            action: 'find',
            data: {
                _id: { $in: dashboard.tagIds }
            },
            isRPC: true
        });
    },
    members(dashboard) {
        return (dashboard.selectedMemberIds || []).map(_id => ({
            __typename: 'User',
            _id
        }));
    },
    itemsCount(dashboard, _args, { models }) {
        return models.DashboardItems.find({ dashboardId: dashboard._id }).count();
    }
};
