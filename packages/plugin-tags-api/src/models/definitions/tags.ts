import { Document, Schema } from 'mongoose';
import { field, schemaHooksWrapper } from './utils';

export interface ITag {
  name: string;
  type: string;
  colorCode?: string;
  objectCount?: number;
  parentId?: string;
}

export interface ITagDocument extends ITag, Document {
  _id: string;
  createdAt: Date;
  order?: string;
  relatedIds?: string[];
}

export const tagSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    name: field({ type: String, label: 'Název' }),
    type: field({
      type: String,
      label: 'Type',
      index: true,
    }),
    colorCode: field({ type: String, label: 'Color code' }),
    createdAt: field({ type: Date, label: 'Vytvořeno v' }),
    objectCount: field({ type: Number, label: 'Object count' }),
    order: field({ type: String, label: 'Objednat', index: true }),
    parentId: field({
      type: String,
      optional: true,
      index: true,
      label: 'Rodič',
    }),
    relatedIds: field({
      type: [String],
      optional: true,
      label: 'Children tag ids',
    }),
  }),
  'saashq_tags',
);

// for tags query. increases search speed, avoids in-memory sorting
tagSchema.index({ type: 1, order: 1, name: 1 });
