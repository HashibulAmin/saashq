import * as mongoose from 'mongoose';
import { IContext as IMainContext } from '@saashq/api-utils/src';

import { IShqDocument, IShqModel, loadShqClass } from './models/Shqs';
import { createGenerateModels } from '@saashq/api-utils/src/core';

export interface IModels {
  Shqs: IShqModel;
}

export interface IContext extends IMainContext {
  models: IModels;
  subdomain: string;
}

export let models: IModels | null = null;

export const loadClasses = (
  db: mongoose.Connection,
  subdomain: string
): IModels => {
  models = {} as IModels;

  models.Shqs = db.model<IShqDocument, IShqModel>(
    'shqs',
    loadShqClass(models, subdomain)
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(
  models,
  loadClasses
);
