import { Document, Schema } from 'mongoose';
import { field, schemaWrapper } from './utils';

export interface IExpense {
  _id?: string;
  name: string;
  description?: string;
}

export interface IExpenseDocument extends IExpense, Document {
  _id: string;
  status: string;
  createdBy: string;
  createdAt: Date;
}

export const expenseSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    name: field({ type: String, label: 'Název', unique: true }),
    description: field({ type: String, optional: true, label: 'Popis' }),
    status: field({ type: String, default: 'active', label: 'Postavení' }),
    createdBy: field({ type: String, label: 'Vytvořil' }),
    createdAt: field({ type: Date, label: 'Vytvořeno v' }),
  }),
);
