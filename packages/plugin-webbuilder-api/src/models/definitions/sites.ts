import { attachmentSchema } from '@saashq/api-utils/src/definitions/common';
import { Document, Schema } from 'mongoose';
import { field } from './utils';

export interface ISite {
  name: string;
  domain?: string;
  templateId?: string;
  coverImage?: any;

  createdBy?: string;
  modifiedBy?: string;
}

export interface ISiteDocument extends ISite, Document {
  _id: string;

  createdAt: Date;
  modifiedAt: Date;
}

export const siteSchema = new Schema({
  name: field({ type: String, label: 'Název', unique: true }),
  domain: field({ type: String, optional: true, label: 'Domain' }),
  templateId: field({ type: String, optional: true, label: 'Template id' }),
  coverImage: field({
    type: attachmentSchema,
    optional: true,
    label: 'Cover image',
  }),

  createdBy: field({ type: String, optional: true, label: 'Created by' }),
  modifiedBy: field({ type: String, optional: true, label: 'Modified by' }),

  createdAt: field({ type: Date, label: 'Vytvořeno v', esType: 'date' }),
  modifiedAt: field({ type: Date, label: 'Upraveno v', esType: 'date' }),
});
