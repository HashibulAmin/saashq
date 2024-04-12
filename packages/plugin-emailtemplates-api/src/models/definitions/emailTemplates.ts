import { Document, Schema } from 'mongoose';
import { field, schemaWrapper } from './utils';

export interface IEmailTemplate {
  name: string;
  content: string;
  status?: string;
  createdAt?: Date;
  modifiedAt?: Date;
  createdBy?: string;
  scopeBrandIds?: string[];
}

export interface IEmailTemplateDocument extends IEmailTemplate, Document {
  _id: string;
}

export const emailTemplateSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    name: field({ type: String, label: 'Název' }),
    status: field({ type: String, label: 'Postavení' }),
    content: field({ type: String, optional: true, label: 'Content' }),
    createdAt: field({
      type: Date,
      label: 'Vytvořeno v',
    }),
    createdBy: field({ type: String, label: 'Created by' }),
    modifiedAt: field({ type: Date, label: 'Upraveno v' }),
  }),
);
