import { Document, Schema } from 'mongoose';
import { field } from './utils';

export interface IInvestment {
  saashqCustomerId: string;
  packageId: string;
  amount: number;
}

export interface IInvestmentDocument extends IInvestment, Document {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}

export const investmentSchema = new Schema({
  _id: field({ pkey: true }),
  saashqCustomerId: field({
    type: String,
    label: 'Customer'
  }),
  amount: field({
    type: Number,
    label: 'Amount'
  }),
  packageId: field({
    type: String,
    label: 'Package'
  }),
  createdAt: field({
    type: Date,
    default: Date.now,
    label: 'Created at'
  }),
  modifiedAt: field({ type: Date, label: 'Modified at' })
});
