import { Document, Schema } from 'mongoose';
import { field, schemaWrapper } from './utils';

export interface IBrandEmailConfig {
  email?: string;
  type?: string;
  template?: string;
}

export interface IBrand {
  code?: string;
  name?: string;
  description?: string;
  memberIds?: string[];
  userId?: string;
  emailConfig?: IBrandEmailConfig;
}

export interface IBrandDocument extends IBrand, Document {
  _id: string;
  createdAt: Date;
}

// Mongoose schemas ===========
export const brandEmailConfigSchema = new Schema(
  {
    type: field({
      type: String,
      enum: ['simple', 'custom'],
      label: 'Typ',
    }),
    template: field({ type: String, label: 'Template', optional: true }),
    email: field({
      type: String,
      label: 'E-mailem',
      optional: true,
    }),
  },
  { _id: false },
);

export const brandSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    code: field({ type: String, label: 'Kód' }),
    name: field({ type: String, label: 'Název' }),
    description: field({
      type: String,
      optional: true,
      label: 'Popis',
    }),
    userId: field({ type: String, label: 'Vytvořil' }),
    createdAt: field({ type: Date, label: 'Vytvořeno v' }),
    emailConfig: field({
      type: brandEmailConfigSchema,
      label: 'Konfigurace e-mailu',
    }),
  }),
);
