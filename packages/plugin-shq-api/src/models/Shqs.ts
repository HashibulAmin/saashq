import { Document, Model, Schema } from 'mongoose';
import { IModels } from '../connectionResolver';
import { field } from '@saashq/api-utils/src/definitions/utils';
import { sendCoreMessage } from '../messageBroker';

export interface IShq {
  name: string;
}

export interface IShqDocument extends IShq, Document {
  _id: string;
}

const featureSchema = new Schema({
  _id: { type: String },
  icon: { type: String },
  name: { type: String },
  description: { type: String },
  contentType: { type: String },
  contentId: { type: String },
  subContentId: { type: String }
});

const appearanceSchema = new Schema(
  {
    primaryColor: { type: String },
    secondaryColor: { type: String },
    bodyColor: { type: String },
    headerColor: { type: String },
    footerColor: { type: String }
  },
  { _id: false }
);

const scoringConfigSchema = new Schema(
  {
    action: { type: String },
    score: { type: String }
  },
  { _id: false }
);

// Mongoose schemas =======================

export const shqSchema = new Schema({
  _id: field({ pkey: true }),
  name: { type: String, label: 'Name' },
  webName: { type: String, label: 'Web Name' },
  webDescription: { type: String, label: 'Web Description' },
  url: { type: String, label: 'Url' },
  description: { type: String, label: 'Description' },
  features: { type: [featureSchema] },
  logo: { type: Object },
  favicon: { type: Object },
  vision: { type: Object },
  structure: { type: Object },
  knowledgeBaseLabel: { type: String, label: 'knowledgeBase label' },
  knowledgeBaseTopicId: { type: String, label: 'knowledgeBase topicId' },
  ticketLabel: { type: String, label: 'ticket label' },
  ticketPipelineId: { type: String, label: 'ticket Pipeline Id' },
  ticketBoardId: { type: String, label: 'ticket BoardId' },
  appearance: { type: appearanceSchema },
  scoringConfig: { type: [scoringConfigSchema] },
  createdBy: { type: String, label: 'Created by' },
  createdAt: { type: Date, label: 'Created at' }
});

export interface IShqModel extends Model<IShqDocument> {
  getShq(_id: string): IShqDocument;
  createShq(doc: IShq, user: any): IShqDocument;
  updateShq(_id: string, doc: IShq): IShqDocument;
  removeShq(_id: string): IShqDocument;
  useScoring(user: any, action: string): IShqDocument;
}

export const loadShqClass = (models: IModels, subdomain: string) => {
  class Shq {
    public static async getShq(_id: string) {
      const shq = await models.Shqs.findOne({ _id });

      if (!shq) {
        throw new Error('Shq not found');
      }

      return shq;
    }

    public static async createShq(doc: IShq, user: any) {
      const shq = await models.Shqs.create({
        createdBy: user._id,
        createdAt: new Date(),
        ...doc
      });

      return shq;
    }

    /*
     * Update shq
     */
    public static async updateShq(_id: string, doc: IShq) {
      await models.Shqs.updateOne({ _id }, { $set: doc });

      return models.Shqs.findOne({ _id });
    }

    /*
     * Remove shq
     */
    public static async removeShq(_id: string) {
      const shqObj = await models.Shqs.getShq(_id);

      return shqObj.remove();
    }

    public static async useScoring(user, action) {
      const shqObj = await models.Shqs.findOne().lean();

      const scoringConfig = (shqObj.scoringConfig || []).find(
        config => config.action === action
      ) || { score: 0 };

      const score = scoringConfig.score || 0;

      await sendCoreMessage({
        subdomain,
        action: 'users.updateOne',
        data: {
          selector: {
            _id: user._id
          },
          modifier: {
            $inc: { score }
          }
        },
        isRPC: true
      });

      return score;
    }
  }

  shqSchema.loadClass(Shq);

  return shqSchema;
};
