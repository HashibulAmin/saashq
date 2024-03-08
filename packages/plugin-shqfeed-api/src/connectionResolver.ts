import * as mongoose from 'mongoose';
import { IContext as IMainContext } from '@saashq/api-utils/src';
import { IFeedDocument, IThankDocument } from './models/definitions/shq';
import {
  loadFeedClass,
  loadShqThankClass,
  IThankModel,
  IFeedModel,
} from './models/shqFeed';
import { createGenerateModels } from '@saashq/api-utils/src/core';

export interface IModels {
  ShqFeed: IFeedModel;
  ShqThanks: IThankModel;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.ShqFeed = db.model<IFeedDocument, IFeedModel>(
    'shq_feeds',
    loadFeedClass(models),
  );

  models.ShqThanks = db.model<IThankDocument, IThankModel>(
    'shq_thanks',
    loadShqThankClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
