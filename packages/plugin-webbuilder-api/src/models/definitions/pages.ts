import { Document, Schema } from 'mongoose';
import { field } from './utils';

export interface IPage {
  siteId: string;
  name: string;
  description: string;
  html: string;
  css: string;
  templateId: string;

  createdBy: string;
  modifiedBy: string;
}

export interface IPageDocument extends IPage, Document {
  _id: string;

  createdAt: Date;
  modifiedAt: Date;
}

export const pageSchema = new Schema({
  siteId: field({ type: String, optional: true, label: 'Site' }),
  name: field({ type: String, label: 'Název' }),
  description: field({ type: String, optional: true, label: 'Popis' }),
  html: field({ type: String, optional: true, label: 'Html' }),
  css: field({ type: String, optional: true, label: 'Css' }),
  templateId: field({ type: String, optional: true, label: 'Template' }),

  createdBy: field({ type: String, optional: true, label: 'Created by' }),
  modifiedBy: field({ type: String, optional: true, label: 'Modified by' }),

  createdAt: field({ type: Date, label: 'Vytvořeno v', esType: 'date' }),
  modifiedAt: field({ type: Date, label: 'Upraveno v', esType: 'date' }),
});
