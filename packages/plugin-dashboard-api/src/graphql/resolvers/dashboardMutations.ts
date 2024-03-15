import { IContext } from '../../connectionResolver';
import {
  IDashboardz,
  IDashboardItemInput,
} from '../../models/definitions/dashboardz';

interface IDashboardEditz extends IDashboardz {
  _id: string;
}
interface IDashboardItemEdit extends IDashboardItemInput {
  _id: string;
}

const dashboardsMutations = {
  async dashboardsAdd(
    _root,
    doc: IDashboardz,
    { docModifier, models, user }: IContext,
  ) {
    const dashboardz = await models.Dashboards.create({
      ...docModifier(doc),
      createdAt: new Date(),
      createdBy: user._id,
      updatedBy: user._id,
    });

    return dashboardz;
  },

  async dashboardsEdit(
    _root,
    { _id, ...fields }: IDashboardEditz,
    { models, user }: IContext,
  ) {
    return models.Dashboards.editDashboard(_id, fields, user);
  },

  async dashboardsRemove(
    _root,
    { dashboardIds }: { dashboardIds: string[] },
    { models }: IContext,
  ) {
    await models.DashboardItems.deleteMany({
      dashboardId: { $in: dashboardIds },
    });

    return models.Dashboards.deleteMany({ _id: { $in: dashboardIds } });
  },

  async dashboardItemsAdd(
    _root,
    doc: IDashboardItemInput,
    { models }: IContext,
  ) {
    const dashboardItem = await models.DashboardItems.addDashboardItem({
      ...doc,
    });

    return dashboardItem;
  },

  async dashboardItemsEdit(
    _root,
    { _id, ...fields }: IDashboardItemEdit,
    { models }: IContext,
  ) {
    return models.DashboardItems.editDashboardItem(_id, fields);
  },

  async dashboardItemsRemove(
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.DashboardItems.removeDashboardItem(_id);
  },
};

export default dashboardsMutations;
