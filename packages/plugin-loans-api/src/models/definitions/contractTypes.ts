import { LEASE_TYPES } from './constants';
import { schemaHooksWrapper, field } from './utils';
import { Schema, Document } from 'mongoose';
export interface IContractConfig {
  receivable: string;
  temp: string;
  giving: string;
  tempDebt: string;

  mainUserEmail: string;
  mainHasVat: string;
  mainHasCitytax: string;
  mainIsEbarimt: string;

  interestReceivable: string;
  interestGiving: string;
  interestCalcedReceive: string;
  interestIncome: string;

  extraInterestUserEmail: string;
  extraInterestHasVat: string;
  extraInterestHasCitytax: string;
  extraInterestIsEbarimt: string;

  insuranceReceivable: string;
  insuranceGiving: string;

  undueStock: string;
  undueUserEmail: string;
  undueHasVat: string;
  undueHasCitytax: string;
  undueIsEbarimt: string;

  otherReceivable: string;
  feeIncome: string;
  defaultCustomer: string;
  userEmail: string;
  repaymentTemp: string;

  isAutoSendEBarimt: boolean;
  productType: string;
  normalExpirationDay: number;
  expiredExpirationDay: number;
  doubtExpirationDay: number;
  negativeExpirationDay: number;
  badExpirationDay: number;
}

export interface IContractType {
  code: string;
  name: string;
  description: string;
  status: string;
  number: string;
  vacancy: number;
  unduePercent: number;
  undueCalcType: string;
  useMargin: boolean;
  useSkipInterest: boolean;
  useDebt: boolean;
  useManualNumbering: boolean;
  useFee: boolean;
  leaseType: string;
  commitmentInterest: number;
  createdAt: Date;
  productCategoryIds: string[];
  config: IContractConfig;
  currency: string;
  savingPlusLoanInterest: number;
  savingUpperPercent: number;
  usePrePayment: boolean;
  invoiceDay: string;
}

export interface IContractTypeDocument extends IContractType, Document {
  _id: string;
}

export const contractTypeSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    code: field({ type: String, label: 'Kód', unique: true }),
    name: field({ type: String, label: 'Název' }),
    description: field({ type: String, optional: true, label: 'Popis' }),
    status: field({ type: String, default: 'active', label: 'Postavení' }),
    number: field({ type: String, label: 'Number' }),
    vacancy: field({
      type: Number,
      min: 1,
      max: 10,
      label: 'Vacancy',
      required: true,
    }),
    unduePercent: field({
      type: Number,
      min: 0,
      max: 100,
      label: 'Undue Percent',
      optional: true,
    }),
    undueCalcType: field({
      type: String,
      label: 'Undue Calc Type',
      optional: true,
    }),
    useDebt: field({
      type: Boolean,
      label: 'Use debt',
      optional: true,
    }),
    useMargin: field({
      type: Boolean,
      label: 'Use margin',
      optional: true,
    }),
    useSkipInterest: field({ type: Boolean, label: 'use skip interest' }),
    useManualNumbering: field({ type: Boolean, label: 'use manual numbering' }),
    useFee: field({ type: Boolean, label: 'use fee' }),
    leaseType: field({
      type: String,
      enum: LEASE_TYPES.ALL,
      label: 'Lease Type',
      required: true,
      default: LEASE_TYPES.FINANCE,
    }),
    commitmentInterest: field({
      type: Number,
      label: 'Commitment Interest',
      default: 0,
    }),
    createdAt: field({
      type: Date,
      default: () => new Date(),
      label: 'Vytvořeno v',
    }),
    productCategoryIds: field({
      type: [String],
      label: 'Allow Product Categories',
    }),
    config: field({ type: Object }),
    currency: field({
      type: String,
      default: 'MNT',
      label: 'contract type currency of lease',
    }),
    productType: field({
      type: String,
      default: 'private',
      label: 'product Type',
    }),
    savingPlusLoanInterest: field({
      type: Number,
      default: 0,
      label: 'Saving loan plus interest',
    }),
    savingUpperPercent: field({
      type: Number,
      default: 0,
      label: 'Saving loan upper percent',
    }),
    usePrePayment: field({
      type: Boolean,
      default: false,
      label: 'use pre payment',
    }),
    invoiceDay: field({
      type: String,
      label: 'invoiceDay',
    }),
  }),
  'saashq_contractTypeSchema',
);
