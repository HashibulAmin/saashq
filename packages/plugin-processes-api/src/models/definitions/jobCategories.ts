import { Document, Schema } from 'mongoose';
import { JOB_CATEGORY_STATUSES } from './constants';
import { field, schemaWrapper } from './utils';

export interface IJobCategory {
  name: string;
  code: string;
  order: string;
  description?: string;
  parentId?: string;
  attachment?: any;
  status?: string;
  createdAt?: Date;
}

export interface IJobCategoryDocument extends IJobCategory, Document {
  _id: string;
  createdAt: Date;
}

export const jobCategorySchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    name: field({ type: String, label: 'Název' }),
    code: field({ type: String, unique: true, label: 'Kód' }),
    order: field({ type: String, label: 'Objednat' }),
    parentId: field({ type: String, optional: true, label: 'Rodič' }),
    description: field({ type: String, optional: true, label: 'Popis' }),
    status: field({
      type: String,
      enum: JOB_CATEGORY_STATUSES.ALL,
      optional: true,
      label: 'Postavení',
      default: 'active',
      esType: 'keyword',
      index: true,
    }),
    createdAt: field({
      type: Date,
      default: new Date(),
      label: 'Vytvořeno v',
    }),
  }),
);
