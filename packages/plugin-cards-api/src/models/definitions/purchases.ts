import { Document, Schema } from 'mongoose';
import { commonItemFieldsSchema, IItemCommonFields } from './boards';

import { EXPENSE_DIVIDE_TYPES } from './constants';
import { field } from './utils';

export interface IProductPurchaseData extends Document {
  productId: string;
  uom: string;
  currency: string;
  quantity: number;
  unitPrice: number;
  globalUnitPrice: number;
  unitPricePercent: number;
  taxPercent?: number;
  tax?: number;
  vatPercent?: number;
  discountPercent?: number;
  discount?: number;
  amount?: number;
  tickUsed?: boolean;
  isVatApplied?: boolean;
  assignUserId?: string;
  branchId?: string;
  departmentId?: string;
  expenseAmount?: number;
}

export interface IExpensesPurchaseData extends Document {
  _id: string;
  name: string;
  value: number;
  type: string;
}

interface IPaymentsPurchaseData {
  [key: string]: {
    currency?: string;
    amount?: number;
  };
}

export interface IPurchase extends IItemCommonFields {
  productsData?: IProductPurchaseData[];
  paymentsData?: IPaymentsPurchaseData[];
  expensesData?: IExpensesPurchaseData[];
}

export interface IPurchaseDocument extends IPurchase, Document {
  _id: string;
}

// Mongoose schemas =======================

export const purchaseproductDataSchema = new Schema(
  {
    _id: field({ pkey: true }),
    productId: field({ type: String, esType: 'keyword' }), // Product
    uom: field({ type: String, esType: 'keyword' }), // Units of measurement
    currency: field({ type: String, esType: 'keyword' }), // Currency
    quantity: field({ type: Number, label: 'Množství' }), // Quantity
    maxQuantity: field({ type: Number, label: 'Max' }), // Max quantity when selected bonus voucher
    unitPrice: field({ type: Number, label: 'Jednotková cena' }), // Unit price
    globalUnitPrice: field({ type: Number, label: 'Globální jednotková cena' }), // Global unit price
    unitPricePercent: field({
      type: Number,
      label: 'Procento jednotkové ceny',
    }), // Unit price percent
    taxPercent: field({ type: Number, label: 'Procento daně' }), // Tax percent
    vatPercent: field({ type: Number, label: 'Procento daně' }), // Vat percent
    tax: field({ type: Number, label: 'Daň' }), // Tax
    discountPercent: field({ type: Number, label: 'Procento slevy' }), // Discount percent
    discount: field({ type: Number, label: 'Sleva' }), // Discount
    amount: field({ type: Number, label: 'Množství' }), // Amount
    tickUsed: field({ type: Boolean, label: 'Použito klíště' }), // TickUsed
    isVatApplied: field({ type: Boolean, label: 'Je aplikována DPH' }), // isVatApplied
    assignUserId: field({ type: String, optional: true, esType: 'keyword' }), // AssignUserId
    branchId: field({ type: String, optional: true, esType: 'keyword' }),
    departmentId: field({ type: String, optional: true, esType: 'keyword' }),
    expenseAmount: field({
      type: Number,
      optional: true,
      label: 'Částka výdajů',
    }), // Expense Amount
  },
  { _id: false },
);

export const expensDataSchema = new Schema({
  _id: field({ pkey: true }),
  name: field({ type: String, esType: 'keyword', label: 'Název' }),
  value: field({ type: Number, label: 'Hodnota nákladů' }),
  type: field({ type: String, enum: EXPENSE_DIVIDE_TYPES.ALL, label: 'Typ' }),
});

export const purchaseSchema = new Schema({
  ...commonItemFieldsSchema,
  productsData: field({ type: [purchaseproductDataSchema], label: 'Produkty' }),
  paymentsData: field({ type: Object, optional: true, label: 'Platby' }),
  expensesData: field({
    type: [expensDataSchema],
    optianal: true,
    label: 'Výdaje',
  }),
});
