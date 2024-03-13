import { IContext } from '../../connectionResolver';
import { sendTagsMessage } from '../../messageBroker';
import { IDashboardDocumentz } from '../../models/definitions/dashboardz';

export default {
  createdUser(dashboardz: IDashboardDocumentz) {
    return (
      dashboardz.createdBy && {
        __typename: 'User',
        _id: dashboardz.createdBy,
      }
    );
  },

  updatedUser(dashboardz: IDashboardDocumentz) {
    return (
      dashboardz.updatedBy && {
        __typename: 'User',
        _id: dashboardz.updatedBy,
      }
    );
  },

  async getTags(dashboardz: IDashboardDocumentz, _, { subdomain }: IContext) {
    return sendTagsMessage({
      subdomain,
      action: 'find',
      data: {
        _id: { $in: dashboardz.tagIds },
      },
      isRPC: true,
      serviceName: 'tags',
    });
  },

  members(dashboardz: IDashboardDocumentz) {
    return (dashboardz.selectedMemberIds || []).map((_id) => ({
      __typename: 'User',
      _id,
    }));
  },

  itemsCount(dashboardz: IDashboardDocumentz, _args, { models }: IContext) {
    return models.DashboardItems.find({
      dashboardId: dashboardz._id,
    }).countDocuments();
  },
};
