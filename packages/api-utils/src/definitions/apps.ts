import { Document, Schema } from 'mongoose';
import { field } from './utils';

export interface IApp {
  isEnabled?: boolean;
  name: string;
  userGroupId: string;
  expireDate?: Date;
  noExpire?: boolean;
  allowAllPermission?: boolean;
}

export interface IAppDocument extends IApp, Document {
  _id: string;
  createdAt: Date;
  accessToken: string;
  refreshToken: string;
}

export const appSchema = new Schema({
  _id: field({ pkey: true }),
  name: field({ type: String, label: 'Název aplikace' }),
  createdAt: field({ type: Date, label: 'Vytvořeno v', default: new Date() }),
  accessToken: field({ type: String, label: 'Přístupový token' }),
  refreshToken: field({
    type: String,
    label: 'Obnovovací token používaný k získání přístupového tokenu',
  }),
  isEnabled: field({ type: Boolean, label: 'Stav aplikace' }),
  userGroupId: field({
    type: String,
    label: 'ID skupiny uživatelů',
    optional: true,
  }),
  expireDate: field({ type: Date, label: 'Datum vypršení platnosti tokenu' }),
  noExpire: field({ type: Boolean, label: 'neVyprší' }),
  allowAllPermission: field({
    type: Boolean,
    label: 'povolitVšechnaOprávnění',
  }),
});
