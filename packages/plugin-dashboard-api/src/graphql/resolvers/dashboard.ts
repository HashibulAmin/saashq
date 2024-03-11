import { IContext } from '../../connectionResolver';
import { sendTagsMessage } from '../../messageBroker';
import { IDashboardDocument2 } from '../../models/definitions/dashboard';

export default {
  createdUser(dashboard: IDashboardDocument2) {
    return (
      dashboard.createdBy && {
        __typename: 'User',
        _id: dashboard.createdBy,
      }
    );
  },

  updatedUser(dashboard: IDashboardDocument2) {
    return (
      dashboard.updatedBy && {
        __typename: 'User',
        _id: dashboard.updatedBy,
      }
    );
  },

  async getTags(dashboard: IDashboardDocument2, _, { subdomain }: IContext) {
    return sendTagsMessage({
      subdomain,
      action: 'find',
      data: {
        _id: { $in: dashboard.tagIds },
      },
      isRPC: true,
      serviceName: 'tags',
    });
  },

  members(dashboard: IDashboardDocument2) {
    return (dashboard.selectedMemberIds || []).map((_id) => ({
      __typename: 'User',
      _id,
    }));
  },

  itemsCount(dashboard: IDashboardDocument2, _args, { models }: IContext) {
    return models.DashboardItems.find({
      dashboardId: dashboard._id,
    }).countDocuments();
  },
};
