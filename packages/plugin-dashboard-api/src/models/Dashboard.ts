import { IUser, IUserDocument } from '@saashq/api-utils/src/types';
import { Model } from 'mongoose';
import _ = require('underscore');
import { IModels } from '../connectionResolver';

import {
  dashboardItemSchema,
  dashboardSchema,
  IDashboardz,
  IDashboardDocumentz,
  IDashboardItemDocument,
  IDashboardItemEdit,
  IDashboardItemInput,
} from './definitions/dashboardz';
import { escapeRegExp } from './definitions/utils';

export interface IDashboardModelz extends Model<IDashboardDocumentz> {
  getDashboard(_id: string): Promise<IDashboardDocumentz>;
  addDashboard(doc: IDashboardz): Promise<IDashboardDocumentz>;
  editDashboard(
    _id: string,
    fields: IDashboardz,
    user: IUserDocument,
  ): Promise<IDashboardDocumentz>;
  removeDashboard(_id: string): void;
  validateUniqueness(selector: any, name: string): Promise<boolean>;
}

export interface IDashboardItemModel extends Model<IDashboardItemDocument> {
  addDashboardItem(doc: IDashboardItemInput): Promise<IDashboardItemDocument>;
  editDashboardItem(
    _id: string,
    fields: IDashboardItemEdit,
  ): Promise<IDashboardItemDocument>;
  removeDashboardItem(_id: string): void;
}

const setRelatedIds = async (
  dashboard: IDashboardDocumentz,
  models: IModels,
) => {
  if (dashboard.parentId) {
    const parentDashboard = await models.Dashboards.findOne({
      _id: dashboard.parentId,
    });

    if (parentDashboard) {
      let relatedIds: string[];

      relatedIds = dashboard.relatedIds || [];
      relatedIds.push(dashboard._id);

      relatedIds = _.union(relatedIds, parentDashboard.relatedIds || []);

      await models.Dashboards.updateOne(
        { _id: parentDashboard._id },
        { $set: { relatedIds } },
      );

      const updated = await models.Dashboards.findOne({
        _id: dashboard.parentId,
      });

      if (updated) {
        await setRelatedIds(updated, models);
      }
    }
  }
};

// remove related dashboards
const removeRelatedIds = async (
  dashboard: IDashboardDocumentz,
  models: IModels,
) => {
  const dashboardz = await models.Dashboards.find({
    relatedIds: { $in: dashboard._id },
  });

  if (dashboardz.length === 0) {
    return;
  }

  const relatedIds: string[] = dashboard.relatedIds || [];

  relatedIds.push(dashboard._id);

  const doc: Array<{
    updateOne: {
      filter: { _id: string };
      update: { $set: { relatedIds: string[] } };
    };
  }> = [];

  dashboardz.forEach(async (t) => {
    const ids = (t.relatedIds || []).filter((id) => !relatedIds.includes(id));

    doc.push({
      updateOne: {
        filter: { _id: t._id },
        update: { $set: { relatedIds: ids } },
      },
    });
  });

  await models.Dashboards.bulkWrite(doc);
};

export const loadDashboardClass = (models: IModels) => {
  class Dashboard {
    public static async getDashboard(_id: string) {
      const dashboard = await models.Dashboards.findOne({ _id });

      if (!dashboard) {
        throw new Error('Dashboard not found');
      }

      return dashboard;
    }

    public static async validateUniqueness(
      selector: any,
      name: string,
    ): Promise<boolean> {
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

      const filter: any = { name };

      if (obj) {
        filter._id = { $ne: obj._id };
      }

      const existing = await models.Dashboards.findOne(filter);

      if (existing) {
        return false;
      }

      return true;
    }

    static async getParentDashboard(doc: IDashboardz) {
      return models.Dashboards.findOne({
        _id: doc.parentId,
      }).lean();
    }

    public static async generateOrder(
      parentDashboard: IDashboardDocumentz,
      { name }: { name: string },
    ) {
      const order = `${name}`;

      if (!parentDashboard) {
        return order;
      }

      let parentOrder = parentDashboard.order;

      if (!parentOrder) {
        parentOrder = `${parentDashboard.name}`;

        await models.Dashboards.updateOne(
          {
            _id: parentDashboard._id,
          },
          { $set: { order: parentOrder } },
        );
      }

      return `${parentOrder}/${order}`;
    }

    public static async addDashboard(doc: IDashboardz) {
      const isUnique = await models.Dashboards.validateUniqueness(
        null,
        doc.name,
      );

      if (!isUnique) {
        throw new Error('Dashboard duplicated');
      }

      const parentDashboard = await this.getParentDashboard(doc);

      // Generating order
      const order = await this.generateOrder(
        parentDashboard as IDashboardDocumentz,
        doc,
      );

      const dashboard = await models.Dashboards.create({
        ...doc,
        order,
        createdAt: new Date(),
      });

      await setRelatedIds(dashboard, models);
      return dashboard;
    }

    public static async editDashboard(
      _id: string,
      doc: IDashboardz,
      user: IUserDocument,
    ) {
      const isUnique = await models.Dashboards.validateUniqueness(
        { _id },
        doc.name,
      );

      if (!isUnique) {
        throw new Error('Dashboard duplicated');
      }

      const parentDashboard = await this.getParentDashboard(doc);

      if (parentDashboard && parentDashboard.parentId === _id) {
        throw new Error('Cannot change dashboard');
      }

      // Generating  order
      const order = await this.generateOrder(
        parentDashboard as IDashboardDocumentz,
        doc,
      );

      const dashboard = await models.Dashboards.findOne({
        _id,
      });

      if (dashboard && dashboard.order) {
        const childDashboards = await models.Dashboards.find({
          $and: [
            {
              order: { $regex: new RegExp(escapeRegExp(dashboard.order), 'i') },
            },
            { _id: { $ne: _id } },
          ],
        });

        if (childDashboards.length > 0) {
          const bulkDoc: Array<{
            updateOne: {
              filter: { _id: string };
              update: { $set: { order: string } };
            };
          }> = [];

          // updating child categories order
          childDashboards.forEach(async (childDashboard) => {
            let childOrder = childDashboard.order;

            if (dashboard.order && childOrder) {
              childOrder = childOrder.replace(dashboard.order, order);

              bulkDoc.push({
                updateOne: {
                  filter: { _id: childDashboard._id },
                  update: { $set: { order: childOrder } },
                },
              });
            }
          });

          await models.Dashboards.bulkWrite(bulkDoc);

          await removeRelatedIds(dashboard, models);
        }
      }

      await models.Dashboards.updateOne(
        { _id },
        { $set: { ...doc, order, updatedAt: new Date(), updatedBy: user._id } },
      );

      const updated = await models.Dashboards.findOne({ _id });

      if (updated) {
        await setRelatedIds(updated, models);
      }

      return updated;
    }

    public static async removeDashboard(_id: string) {
      const dashboard = await models.Dashboards.getDashboard(_id);
      const childCount = await models.Dashboards.countDocuments({
        parentId: _id,
      });

      if (childCount > 0) {
        throw new Error('Please remove child dashboards first');
      }

      await removeRelatedIds(dashboard, models);

      return models.Dashboards.deleteOne({ _id });
    }
  }

  dashboardSchema.loadClass(Dashboard);

  return dashboardSchema;
};

export const loadDashboardItemClass = (models: IModels) => {
  class DashboardItem {
    public static addDashboardItem(doc: IDashboardItemEdit) {
      return models.DashboardItems.create(doc);
    }

    public static async editDashboardItem(_id: string, fields: IDashboardz) {
      await models.DashboardItems.updateOne({ _id }, { $set: fields });

      return models.DashboardItems.findOne({ _id });
    }

    public static async removeDashboardItem(_id: string) {
      await models.DashboardItems.deleteOne({ _id });
    }
  }

  dashboardItemSchema.loadClass(DashboardItem);

  return dashboardItemSchema;
};
