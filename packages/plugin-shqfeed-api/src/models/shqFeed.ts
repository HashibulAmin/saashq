import {
  feedSchema,
  TShqThank,
  thankSchema,
  IFeedDocument,
  IThankDocument
} from './definitions/shq';

import { Model } from 'mongoose';

export const loadFeedClass = models => {
  class Feed {
    public static async getShqFeed(_id: string) {
      const shq = await models.ShqFeed.findOne({ _id });

      if (!shq) {
        throw new Error('Feed not found');
      }

      return shq;
    }

    public static async removeFeeds(ids: string[]) {
      await models.ShqFeed.deleteMany({
        _id: { $in: ids }
      });
    }

    /*
     * Create new shq
     */
    public static async createShqFeed(doc: any, user: any) {
      if (doc && doc.contentType === 'event') {
        const { eventData } = doc;

        if (!eventData.startDate || !eventData.endDate) {
          throw new Error('StartDate and EndDate must be chosen');
        }

        if (!eventData.where) {
          throw new Error('Where must be chosen');
        }
      }

      const shq = await models.ShqFeed.create({
        createdBy: user._id,
        createdAt: doc.createdAt || new Date(),
        ...doc
      });

      return shq;
    }

    /*
     * Update shq
     */
    public static async updateShqFeed(_id: string, doc: TShqThank, user: any) {
      await models.ShqFeed.updateOne(
        { _id },
        {
          $set: {
            updatedBy: user._id,
            updatedAt: new Date(),
            ...doc
          }
        }
      );

      return models.ShqFeed.findOne({ _id });
    }

    /*
     * Remove shq
     */
    public static async removeShqFeed(_id: string) {
      const shqObj = await models.ShqFeed.findOne({ _id });

      if (!shqObj) {
        throw new Error(`Feed not found with id ${_id}`);
      }

      return shqObj.remove();
    }
  }
  feedSchema.loadClass(Feed);
  return feedSchema;
};
export interface IFeedModel extends Model<IFeedDocument> {
  getShqFeed(_id: string);
  removeFeeds(ids: string[]);
  createShqFeed(doc: any, user: any);
  updateShqFeed(_id: string, doc: TShqThank, user: any);
  removeShqFeed(_id: string);
}

export const loadShqThankClass = models => {
  class ShqThank {
    public static async getThank(_id: string) {
      const thank = await models.ShqThanks.findOne({ _id });

      if (!thank) {
        throw new Error('Thank you not found');
      }

      return thank;
    }

    /*
     * Create new thank
     */
    public static async createThank(doc: TShqThank, user: any) {
      const thank = await models.ShqThanks.create({
        createdBy: user._id,
        createdAt: new Date(),
        ...doc
      });

      return thank;
    }

    /*
     * Update thank
     */
    public static async updateThank(_id: string, doc: TShqThank, user: any) {
      await models.ShqThanks.updateOne(
        { _id },
        {
          $set: {
            updatedBy: user._id,
            updatedAt: new Date(),
            ...doc
          }
        }
      );

      return models.ShqThanks.findOne({
        _id
      });
    }

    /*
     * Remove thank
     */
    public static async removeThank(_id: string) {
      const thankObj = await models.ShqThanks.findOne({ _id });

      if (!thankObj) {
        throw new Error(`Thank you not found with id ${_id}`);
      }

      return thankObj.remove();
    }
  }
  thankSchema.loadClass(ShqThank);
  return thankSchema;
};
export interface IThankModel extends Model<IThankDocument> {
  getThank(_id: string);
  createThank(doc: TShqThank, user: any);
  updateThank(_id: string, doc: TShqThank, user: any);
  removeThank(_id: string);
}
