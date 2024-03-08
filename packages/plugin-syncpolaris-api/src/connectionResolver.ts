import * as mongoose from 'mongoose';
import { IContext as IMainContext } from '@saashq/api-utils/src';
import { createGenerateModels } from '@saashq/api-utils/src/core';
import { ISyncLogDocument } from './models/definitions/syncLog';
import { ISyncLogModel, loadSyncLogClass } from './models/SyncLog';

export interface IModels {
  SyncLogs: ISyncLogModel;
}
export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.SyncLogs = db.model<ISyncLogDocument, ISyncLogModel>(
    'syncpolaris_synclogs',
    loadSyncLogClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
