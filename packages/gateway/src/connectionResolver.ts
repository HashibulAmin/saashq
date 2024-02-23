import * as mongoose from 'mongoose';
import { IContext as IMainContext } from '@saashq/api-utils/src';
import { userSchema } from '@saashq/api-utils/src/definitions/users';
import { permissionSchema } from '@saashq/api-utils/src/definitions/permissions';
import { appSchema } from '@saashq/api-utils/src/definitions/apps';
import { createGenerateModels } from '@saashq/api-utils/src/core';

export interface IModels {
  Users: any;
  Permissions: any;
  Apps: any;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export let models: IModels | null = null;

export const loadClasses = (db: mongoose.Connection): IModels => {
  models = {} as IModels;

  models.Users = db.model('users', userSchema);
  models.Permissions = db.model('permissions', permissionSchema);
  models.Apps = db.model('apps', appSchema);

  return models;
};

export const generateModels = createGenerateModels<IModels>(models, loadClasses);