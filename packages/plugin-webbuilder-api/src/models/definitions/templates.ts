import { Document, Schema } from 'mongoose';
import { field } from './utils';

export interface ITemplate {
  name: string;
  html: string;
}

export interface ITemplateDocument extends ITemplate, Document {
  _id: string;
}

export const templateSchema = new Schema({
  name: field({ type: String, label: 'Název' }),
  html: field({ type: String, label: 'Html' }),
});
