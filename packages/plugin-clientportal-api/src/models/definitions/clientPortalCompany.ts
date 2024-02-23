import { field } from '@saashq/api-utils/src';
import { Document, Schema } from 'mongoose';

export interface IClientCompany {
  saashqCompanyId: string;
  productCategoryIds?: string[];
  clientPortalId: string;
}

export interface IClientCompanyDocument extends IClientCompany, Document {
  _id: string;
  createdAt?: Date;
}

export const companySchema = new Schema({
  _id: field({ pkey: true }),
  saashqCompanyId: field({ type: String }),
  productCategoryIds: field({ type: [String] }),
  clientPortalId: field({ type: String }),
  createdAt: field({ type: Date, default: Date.now })
});
