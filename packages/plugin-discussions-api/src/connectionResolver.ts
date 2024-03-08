import * as mongoose from 'mongoose';
import {
  IDiscussionModel,
  loadDiscussionClass,
  IDiscussionDocument,
} from './models/Discussions';
import { IVoteModel, loadVoteClass, IVoteDocument } from './models/Votes';
import { IContext as IMainContext } from '@saashq/api-utils/src';
import { createGenerateModels } from '@saashq/api-utils/src/core';

export interface IModels {
  Discussions: IDiscussionModel;
  Votes: IVoteModel;
}
export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export const loadClasses = (
  db: mongoose.Connection,
  _subdomain: string,
): IModels => {
  const models = {} as IModels;

  models.Discussions = db.model<IDiscussionDocument, IDiscussionModel>(
    'discussions',
    loadDiscussionClass(models),
  );

  models.Votes = db.model<IVoteDocument, IVoteModel>(
    'discussions_votes',
    loadVoteClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
