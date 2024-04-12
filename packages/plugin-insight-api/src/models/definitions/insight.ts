import { Document, Schema } from 'mongoose';
import { field, schemaHooksWrapper } from './utils';

enum IVisibilityType {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export interface IChartFilterType {
  type: String;
  enum: ['date', 'string', 'number'];
}

export interface IChartType {
  type: String;
  enum: ['pie', 'bar', 'line'];
}

export interface IDashboard {
  _id: string;
  name: string;
  sectionId: string;

  assignedUserIds: string[];
  assignedDepartmentIds: string[];

  visibility: IVisibilityType;
  memberIds: string[];

  serviceNames?: string[];
  serviceTypes?: string[];
  charts?: IChartDocument[];

  createdAt: Date;
  createdBy: string;

  updatedAt: Date;
  updatedBy: string;
}

export interface IDashboardDocument extends IDashboard, Document {
  _id: string;
}

export interface ISection {
  name: string;
  type: string;

  createdAt: Date;
  createdBy: string;

  updatedAt: Date;
  updatedBy: string;
}

export interface ISectionDocument extends ISection, Document {
  _id: string;
}

export interface IChart {
  name: string;
  dashboardId: string;
  contentType: string;
  templateType: string;
  order: number;
  chartType: string;
  filterIds: string[];
  defaultFilter: IChartFilter;
  serviceName?: string;

  dimension: JSON;

  vizState: string;
  layout: string;
}

export interface IChartEdit {
  layout?: string;
  vizState?: string;
  name?: string;
  type?: string;
}

export interface IChartFilter {
  fieldName: string;
  filterValue: string;
  filterType: IChartFilterType;
}

export interface IChartDocument extends IChart, Document {
  _id: string;
}

export const dashboardSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    name: field({ type: String, label: 'Název' }),
    sectionId: field({ type: String, label: 'Section id' }),
    visibility: field({
      type: String,
      label: 'Report visibility',
    }),
    assignedUserIds: field({ type: [String], label: 'Assigned member ids' }),
    assignedDepartmentIds: field({
      type: [String],
      label: 'Assigned department ids',
    }),
    serviceNames: field({ type: [String], label: 'Selected service names' }),
    serviceTypes: field({ type: [String], label: 'Selected types' }),
    createdAt: field({
      default: Date.now(),
      type: Date,
      label: 'Vytvořeno v',
      index: true,
    }),
    createdBy: field({
      type: String,
      label: 'Created by user id',
      index: true,
    }),
    updatedAt: field({
      type: Date,
      label: 'Last updated at',
    }),
    updatedBy: field({
      type: String,
      label: 'Last updated by user id',
    }),
  }),
  'saashq_dashboard',
);

export const sectionSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    name: field({ type: String, label: 'Název' }),
    type: field({ type: String, label: 'Type' }),
    createdAt: field({
      default: Date.now(),
      type: Date,
      label: 'Vytvořeno v',
      index: true,
    }),
    createdBy: field({
      type: String,
      label: 'Created by user id',
      index: true,
    }),
    updatedAt: field({
      type: Date,
      label: 'Last updated at',
    }),
    updatedBy: field({
      type: String,
      label: 'Last updated by user id',
    }),
  }),
  'saashq_section',
);

export const chartSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    name: field({ type: String, label: 'Chart name', index: true }),
    dashboardId: field({
      type: String,
      label: 'Id of a corresponding dashboard',
      index: true,
    }),
    contentType: field({ type: String, label: 'Content type' }),
    serviceName: field({ type: String, label: 'Service name' }),
    layout: field({ type: String, label: 'Dashboard item - layout' }),
    vizState: field({ type: String }),
    templateType: field({
      type: String,
      label: 'Template name coming from plugins config',
      index: true,
    }),
    order: field({ type: Number, label: 'Order number' }),
    chartType: field({ type: String, label: 'Chart type' }),
    filter: field({ type: JSON, label: 'Filters' }),
    dimension: field({ type: JSON, label: 'Dimension' }),
    defaultFilterId: field({ type: String, label: 'Default filter id' }),
  }),
  'saashq_dashboard_chart',
);
