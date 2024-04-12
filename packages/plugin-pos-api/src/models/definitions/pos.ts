import { Document, Schema } from 'mongoose';
import { field, schemaHooksWrapper } from './utils';

export interface IPos {
  name: string;
  description?: string;
  orderPassword?: string;
  scopeBrandIds?: string[];
  pdomain?: string;
  userId: string;
  createdAt: Date;
  productDetails?: string;
  adminIds?: string[];
  cashierIds?: string[];
  paymentIds?: string[];
  paymentTypes?: any[];
  saashqAppToken: string;
  isOnline?: Boolean;
  onServer?: Boolean;
  branchId?: string;
  departmentId?: string;
  allowBranchIds?: string[];
  beginNumber?: string;
  maxSkipNumber?: number;
  waitingScreen?: any;
  kioskMachine?: any;
  kitchenScreen?: any;
  uiOptions?: any;
  token: string;
  ebarimtConfig?: any;
  erkhetConfig?: any;
  syncInfos?: any;
  catProdMappings?: any;
  initialCategoryIds?: string;
  kioskExcludeCategoryIds?: string;
  kioskExcludeProductIds?: string;
  deliveryConfig?: any;
  cardsConfig?: any;
  checkRemainder?: boolean;
  permissionConfig?: any;
  allowTypes: string[];
  isCheckRemainder: boolean;
  checkExcludeCategoryIds: string[];
  banFractions: boolean;
}
export interface IPosDocument extends IPos, Document {
  _id: string;
}

export interface IProductGroup {
  name: string;
  description: string;
  posId: string;
  categoryIds?: string[];
  excludedCategoryIds?: string[];
  excludedProductIds: string[];
}
export interface IProductGroupDocument extends IProductGroup, Document {
  _id: string;
}

export interface IPosSlot {
  _id?: string;
  posId: string;
  name: string;
  code: string;
  options: {
    [key: string]: string | number;
  };
}

export interface IPosSlotDocument extends IPosSlot, Document {
  _id: string;
}

export const posSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    name: field({ type: String, label: 'Název' }),
    description: field({ type: String, label: 'Popis', optional: true }),
    orderPassword: field({
      type: String,
      label: 'OrderPassword',
      optional: true,
    }),
    pdomain: field({ type: String, optional: true, label: 'Domain' }),
    userId: field({ type: String, optional: true, label: 'Created by' }),
    createdAt: field({ type: Date, label: 'Vytvořeno v' }),
    productDetails: field({ type: [String], label: 'Product fields' }),
    adminIds: field({ type: [String], label: 'Admin user ids' }),
    cashierIds: field({ type: [String], label: 'Cashier ids' }),
    isOnline: field({ type: Boolean, label: 'Is online pos' }),
    paymentIds: field({ type: [String], label: 'Online Payments' }),
    paymentTypes: field({ type: [Object], label: 'Other Payments' }),
    onServer: field({
      type: Boolean,
      optional: true,
      label: 'On cloud server',
    }),
    branchId: field({ type: String, optional: true, label: 'Branch' }),
    departmentId: field({ type: String, optional: true, label: 'Branch' }),
    allowBranchIds: field({
      type: [String],
      optional: true,
      label: 'Allow branches',
    }),
    beginNumber: field({ type: String, optional: true, label: 'Begin number' }),
    maxSkipNumber: field({
      type: Number,
      optional: true,
      label: 'Skip number',
    }),
    waitingScreen: field({ type: Object, label: 'Waiting screen config' }),
    kioskMachine: field({ type: Object, label: 'Kiosk config' }),
    kitchenScreen: field({ type: Object, label: 'Kitchen screen config' }),
    uiOptions: field({ type: Object, label: 'UI Options' }),
    token: field({ type: String, label: 'Pos token' }),
    saashqAppToken: field({ type: String, label: 'SaasHQ App token' }),
    ebarimtConfig: field({
      type: Object,
      optional: true,
      label: 'Ebarimt Config',
    }),
    erkhetConfig: field({ type: Object, label: 'Erkhet Config' }),
    syncInfos: field({ type: Object, label: 'sync info' }),
    catProdMappings: field({
      type: [Object],
      label: 'Category product mappings',
      optional: true,
    }),
    initialCategoryIds: field({
      type: [String],
      label: 'Pos initial categories',
    }),
    kioskExcludeCategoryIds: field({
      type: [String],
      label: 'Kiosk exclude categories',
    }),
    kioskExcludeProductIds: field({
      type: [String],
      label: 'Kiosk exclude products',
    }),
    deliveryConfig: field({ type: Object, label: 'Delivery Config' }),
    cardsConfig: field({ type: Object, label: 'Cards Config' }),
    checkRemainder: field({ type: Boolean, optional: true }),
    permissionConfig: field({
      type: Object,
      optional: true,
      label: 'Permission',
    }),
    allowTypes: field({ type: [String], label: 'Allow Types' }),
    isCheckRemainder: field({ type: Boolean, label: 'is Check Remainder' }),
    checkExcludeCategoryIds: field({
      type: [String],
      label: 'Check Exclude Categories',
    }),
    banFractions: field({ type: Boolean, label: 'has Float count' }),
    status: field({ type: String, label: 'Postavení', optional: true }),
  }),
  'saashq_pos',
);

export const productGroupSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    name: field({ type: String, label: 'Název' }),
    description: field({ type: String, label: 'Popis', optional: true }),
    posId: field({ type: String, label: 'Pos id' }),
    categoryIds: field({
      type: [String],
      optional: true,
      label: 'Category ids',
    }),

    excludedCategoryIds: field({
      type: [String],
      optional: true,
      label: 'Exclude Category ids',
    }),

    excludedProductIds: field({
      type: [String],
      optional: true,
      label: 'Exclude Product ids',
    }),
  }),
  'saashq_productGroup',
);

export const posSlotSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    name: field({ type: String, label: 'Název' }),
    code: field({ type: String, label: 'Kód' }),
    posId: field({ type: String, label: 'Pos' }),
    option: field({ type: Object, label: 'Option' }),
  }),
  'saashq_pos_slot',
);

export const posCoverKindValueSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    code: field({ type: String, label: 'Kód' }),
  }),
  'saashq_pos_slot',
);
