import { IContext } from '../../connectionResolver';
import {
  IDashboard2,
  IDashboardItemInput,
} from '../../models/definitions/dashboard2';

interface IDashboardEdit2 extends IDashboard2 {
  _id: string;
}
interface IDashboardItemEdit extends IDashboardItemInput {
  _id: string;
}

const dashboardsMutations = {
  async dashboardsAdd(
    _root,
    doc: IDashboard2,
    { docModifier, models, user }: IContext,
  ) {
    const dashboard2 = await models.Dashboards.create({
      ...docModifier(doc),
      createdAt: new Date(),
      createdBy: user._id,
      updatedBy: user._id,
    });

    return dashboard2;
  },

  async dashboardsEdit(
    _root,
    { _id, ...fields }: IDashboardEdit2,
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
