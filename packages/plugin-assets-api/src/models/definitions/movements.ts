import { Schema } from 'mongoose';
import { field, schemaWrapper } from './utils';

export const sourceLocationsShema = new Schema(
  {
    branchId: field({ type: String, label: 'ID Pobočky' }),
    departmentId: field({ type: String, label: 'ID  Oddělení' }),
    customerId: field({
      type: String,
      label: 'Zákaznické Identifikační číslo',
    }),
    teamMemberId: field({ type: String, label: 'ID člena Týmu' }),
    companyId: field({ type: String, label: 'ID Společnosti' }),
  },
  { _id: false },
);

export const movementItemsSchema = schemaWrapper(
  new Schema({
    assetId: field({ type: String, label: 'ID Aktiva' }),
    createdAt: field({ type: Date, label: 'Vytvořeno v', default: Date.now }),
    branchId: field({ type: String, optional: true, label: 'ID Pobočky' }),
    departmentId: field({
      type: String,
      optional: true,
      label: 'ID  Oddělení',
    }),
    teamMemberId: field({
      type: String,
      optional: true,
      label: 'ID člena Týmu',
    }),
    companyId: field({ type: String, optional: true, label: 'ID Společnosti' }),
    customerId: field({
      type: String,
      optional: true,
      label: 'Zákaznické Identifikační číslo',
    }),
    movementId: field({ type: String, optional: true, label: 'ID Pohybu' }),
    sourceLocations: field({
      type: sourceLocationsShema,
      label: 'Umístění Zdroje',
      default: {},
    }),
  }),
);

export const movementSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    createdAt: field({ type: Date, label: 'Vytvořeno v' }),
    modifiedAt: field({ type: Date, label: 'Upraveno v' }),
    movedAt: field({ type: Date, label: 'Datum Přesunu' }),
    description: field({ type: String, label: 'Popis' }),
    userId: field({ type: String, label: 'Uživatelské ID' }),
  }),
);
