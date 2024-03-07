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

export const loadClasses = (
  db: mongoose.Connection,
  subdomain: string,
): IModels => {
  const models = {} as IModels;

  models.Shqs = db.model<IShqDocument, IShqModel>(
    'exms',
    loadShqClass(models, subdomain),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
