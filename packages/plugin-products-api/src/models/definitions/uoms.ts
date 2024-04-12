import { Schema, Document } from 'mongoose';

import { field, schemaWrapper } from './utils';

export interface IUom {
  code: string;
  name: string;
}

export interface IUomDocument extends IUom, Document {
  _id: string;
  createdAt: Date;
}

export const uomSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    name: field({ type: String, label: 'Název' }),
    code: field({ type: String, unique: true, label: 'Kód' }),
    createdAt: field({
      type: Date,
      default: new Date(),
      label: 'Vytvořeno v',
    }),
  }),
);
