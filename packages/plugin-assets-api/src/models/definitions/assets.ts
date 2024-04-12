import {
  attachmentSchema,
  customFieldSchema,
} from '@saashq/api-utils/src/types';
import { Schema } from 'mongoose';
import {
  ASSET_CATEGORY_STATUSES,
  ASSET_STATUSES,
} from '../../common/constant/asset';
import { field, schemaWrapper } from './utils';

export const assetCategoriesSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    name: field({ type: String, label: 'Název' }),
    code: field({ type: String, unique: true, label: 'Kód' }),
    order: field({ type: String, label: 'Objednat' }),
    parentId: field({ type: String, optional: true, label: 'Rodič' }),
    description: field({ type: String, optional: true, label: 'Popis' }),
    attachment: field({ type: attachmentSchema }),
    status: field({
      type: String,
      enum: ASSET_CATEGORY_STATUSES.ALL,
      optional: true,
      label: 'Postavení',
      default: 'active',
      esType: 'keyword',
      index: true,
    }),
    createdAt: field({
      type: Date,
      default: new Date(),
      label: 'Vytvořeno v',
    }),
  }),
);

export const assetSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    name: field({ type: String, label: 'Název' }),
    code: field({ type: String, unique: true, label: 'Kód' }),
    order: field({ type: String, label: 'Objednat' }),
    categoryId: field({ type: String, optional: true, label: 'Kategorie' }),
    parentId: field({ type: String, optional: true, label: 'Rodič' }),
    description: field({ type: String, optional: true, label: 'Popis' }),
    unitPrice: field({
      type: Number,
      optional: true,
      label: 'Jednotková cena',
    }),
    customFieldsData: field({
      type: [customFieldSchema],
      optional: true,
      label: 'Data vlastních polí',
    }),
    createdAt: field({
      type: Date,
      default: new Date(),
      label: 'Vytvořeno v',
    }),
    attachment: field({ type: attachmentSchema }),
    attachmentMore: field({ type: [attachmentSchema] }),
    status: field({
      type: String,
      enum: ASSET_STATUSES.ALL,
      optional: true,
      label: 'Postavení',
      default: 'active',
      esType: 'keyword',
      index: true,
    }),
    vendorId: field({ type: String, optional: true, label: 'Prodejce' }),
    mergedIds: field({ type: [String], optional: true }),
    kbArticleIds: field({ type: [String], optional: true }),
  }),
);
