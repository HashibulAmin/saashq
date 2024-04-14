import { Document, Schema } from 'mongoose';
import { field } from './utils';

export interface IChecklist {
  contentType: string;
  contentTypeId: string;
  title: string;
}

export interface IChecklistDocument extends IChecklist, Document {
  _id: string;
  createdUserId: string;
  createdDate: Date;
}

export interface IChecklistItem {
  checklistId: string;
  content: string;
  isChecked: boolean;
}

export interface IChecklistItemDocument extends IChecklistItem, Document {
  _id: string;
  order: number;
  createdUserId: string;
  createdDate: Date;
}

// Mongoose schemas =======================

export const checklistSchema = new Schema({
  _id: field({ pkey: true }),
  contentType: field({
    type: String,
    label: 'Typ obsahu',
    index: true,
  }),
  order: field({ type: Number }),
  contentTypeId: field({
    type: String,
    label: 'Položka typu obsahu',
    index: true,
  }),
  title: field({ type: String, label: 'Titul' }),
  createdUserId: field({ type: String, label: 'Vytvořil' }),
  createdDate: field({ type: Date, label: 'Vytvořeno v' }),
});

export const checklistItemSchema = new Schema({
  _id: field({ pkey: true }),
  checklistId: field({ type: String, label: 'Kontrolní seznam', index: true }),
  content: field({ type: String, label: 'Obsah' }),
  isChecked: field({ type: Boolean, label: 'Je zaškrtnuto' }),
  createdUserId: field({ type: String, label: 'Vytvořil' }),
  createdDate: field({ type: Date, label: 'Vytvořeno v' }),
  order: field({ type: Number }),
});
