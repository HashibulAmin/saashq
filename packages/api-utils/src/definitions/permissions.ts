import { Document, Schema } from 'mongoose';
import { field } from './utils';

export interface IPermission {
  module: string;
  action: string;
  userId?: string;
  groupId?: string;
  requiredActions: string[];
  allowed: boolean;
}

export interface IPermissionDocument extends IPermission, Document {
  _id: string;
}

export interface IPermissionParams {
  module: string;
  actions: string[];
  userIds?: string[];
  groupIds?: string[];
  allowed: boolean;
}

export const permissionSchema = new Schema({
  _id: field({ pkey: true }),
  module: field({ type: String, label: 'Modul' }),
  action: field({ type: String, label: 'Akce' }),
  userId: field({ type: String, label: 'Uživatel' }),
  groupId: field({ type: String, label: 'Uživatelská skupina' }),
  requiredActions: field({
    type: [String],
    default: [],
    label: 'Požadované akce',
  }),
  allowed: field({ type: Boolean, default: false, label: 'Povoleno' }),
});

export interface IUserGroup {
  name?: string;
  description?: string;
}

export interface IUserGroupDocument extends IUserGroup, Document {
  _id: string;
}

export const userGroupSchema = new Schema({
  _id: field({ pkey: true }),
  name: field({ type: String, unique: true, label: 'Název' }),
  description: field({ type: String, label: 'Popis' }),
});
