import { IContext } from '../../connectionResolver';
import { sendTagsMessage } from '../../messageBroker';
import { IDashboardDocument2 } from '../../models/definitions/dashboard2';

export default {
  createdUser(dashboard2: IDashboardDocument2) {
    return (
      dashboard2.createdBy && {
        __typename: 'User',
        _id: dashboard2.createdBy,
      }
    );
  },

  updatedUser(dashboard2: IDashboardDocument2) {
    return (
      dashboard2.updatedBy && {
        __typename: 'User',
        _id: dashboard2.updatedBy,
      }
    );
  },

  async getTags(dashboard2: IDashboardDocument2, _, { subdomain }: IContext) {
    return sendTagsMessage({
      subdomain,
      action: 'find',
      data: {
        _id: { $in: dashboard2.tagIds },
      },
      isRPC: true,
      serviceName: 'tags',
    });
  },

  members(dashboard2: IDashboardDocument2) {
    return (dashboard2.selectedMemberIds || []).map((_id) => ({
      __typename: 'User',
      _id,
    }));
  },

  itemsCount(dashboard2: IDashboardDocument2, _args, { models }: IContext) {
    return models.DashboardItems.find({
      dashboardId: dashboard2._id,
    }).countDocuments();
  },
};
