import { Document, Schema } from 'mongoose';
import { customFieldSchema, ICustomField, ILink } from '../types';
import { IPermissionDocument } from './permissions';
import { field, schemaWrapper } from './utils';
import { USER_ROLES } from '../constants';

export interface IEmailSignature {
  brandId?: string;
  signature?: string;
}

export interface IEmailSignatureDocument extends IEmailSignature, Document {}

export interface IDetail {
  avatar?: string;
  coverPhoto?: string;
  fullName?: string;
  shortName?: string;
  position?: string;
  birthDate?: Date;
  workStartedDate?: Date;
  location?: string;
  description?: string;
  operatorPhone?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
}

export interface IDetailDocument extends IDetail, Document {}

export interface IUser {
  createdAt?: Date;
  username?: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  registrationToken?: string;
  registrationTokenExpires?: Date;
  isOwner?: boolean;
  email?: string;
  getNotificationByEmail?: boolean;
  emailSignatures?: IEmailSignature[];
  starredConversationIds?: string[];
  details?: IDetail;
  links?: ILink;
  isActive?: boolean;
  brandIds?: string[];
  groupIds?: string[];
  deviceTokens?: string[];
  code?: string;
  doNotDisturb?: string;
  isSubscribed?: string;
  sessionCode?: string;
  isShowNotification?: boolean;
  score?: number;
  customFieldsData?: ICustomField[];
  departmentIds?: string[];
  branchIds?: string[];
  positionIds?: string[];
  employeeId?: string;
  chatStatus?: string;
}

export interface IUserChatStatus {
  type: String;
  enum: ['online', 'offline'];
}

export interface IUserDocument extends IUser, Document {
  _id: string;
  emailSignatures?: IEmailSignatureDocument[];
  details?: IDetailDocument;
  customPermissions?: IPermissionDocument[];
  role?: string;
  appId?: string;
}

// Mongoose schemas ===============================
const UserChatStatus = new Schema({
  type: String,
  enum: ['online', 'offline'],
});

const emailSignatureSchema = new Schema(
  {
    brandId: field({ type: String, label: 'Značka podpisu e-mailu' }),
    signature: field({ type: String, label: 'Emailový podpis' }),
  },
  { _id: false },
);

// Detail schema
const detailSchema = new Schema(
  {
    avatar: field({ type: String, label: 'Avatar' }),
    coverPhoto: field({ type: String, label: 'Úvodní fotka' }),
    shortName: field({ type: String, optional: true, label: 'Krátké jméno' }),
    fullName: field({ type: String, label: 'Celé jméno' }),
    birthDate: field({ type: Date, label: 'Datum narození' }),
    workStartedDate: field({ type: Date, label: 'Datum připojení k práci' }),
    position: field({ type: String, label: 'Pozice' }),
    location: field({ type: String, optional: true, label: 'Umístění' }),
    description: field({ type: String, optional: true, label: 'Popis' }),
    operatorPhone: field({
      type: String,
      optional: true,
      label: 'Telefon operátora',
    }),
    firstName: field({ type: String, label: 'Jméno' }),
    middleName: field({ type: String, label: 'Prostřední jméno' }),
    lastName: field({ type: String, label: 'Příjmení' }),
  },
  { _id: false },
);

// User schema
export const userSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    createdAt: field({
      type: Date,
      default: Date.now,
      label: 'Vytvořeno v',
    }),
    username: field({ type: String, label: 'Uživatelské jméno' }),
    password: field({ type: String }),
    resetPasswordToken: field({ type: String }),
    registrationToken: field({ type: String }),
    registrationTokenExpires: field({ type: Date }),
    resetPasswordExpires: field({ type: Date }),
    isOwner: field({ type: Boolean, label: 'Je majitel' }),
    departmentIds: field({ type: [String], label: 'ID Oddělení' }),
    branchIds: field({ type: [String], label: 'ID Poboček' }),
    positionIds: field({ type: [String], label: 'ID Pozic' }),
    email: field({
      type: String,
      unique: true,
      match: [
        /**
         * RFC 5322 compliant regex. Taken from http://emailregex.com/
         */
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Vyplňte prosím platnou e-mailovou adresu',
      ],
      label: 'E-mailem',
    }),
    getNotificationByEmail: field({
      type: Boolean,
      label: 'Získejte upozornění e-mailem',
    }),
    emailSignatures: field({
      type: [emailSignatureSchema],
      label: 'E-mailové podpisy',
    }),
    starredConversationIds: field({
      type: [String],
      label: 'Konverzace označené hvězdičkou',
    }),
    details: field({ type: detailSchema, default: {}, label: 'Podrobnosti' }),
    links: field({ type: Object, default: {}, label: 'Odkazy' }),
    isActive: field({ type: Boolean, default: true, label: 'Je aktivní' }),
    brandIds: field({ type: [String], label: 'Značky' }),
    groupIds: field({ type: [String], label: 'Skupiny' }),
    deviceTokens: field({
      type: [String],
      default: [],
      label: 'Tokeny zařízení',
    }),
    code: field({ type: String }),
    doNotDisturb: field({
      type: String,
      optional: true,
      default: 'Ne',
      label: 'Nerušit',
    }),
    isSubscribed: field({
      type: String,
      optional: true,
      default: 'Ano',
      label: 'Odebíráno',
    }),
    isShowNotification: field({
      type: Boolean,
      optional: true,
      default: false,
      label: 'Zkontrolujte, zda uživatel zobrazuje',
    }),
    score: field({
      type: Number,
      optional: true,
      label: 'Skóre',
      esType: 'number',
      default: 0,
    }),
    customFieldsData: field({
      type: [customFieldSchema],
      optional: true,
      label: 'Data vlastních polí',
    }),
    role: field({
      type: String,
      label: 'Uživatelská role',
      optional: true,
      default: USER_ROLES.USER,
      enum: USER_ROLES.ALL,
    }),
    appId: field({
      type: String,
      label: 'ID propojené aplikace',
      optional: true,
    }),
    employeeId: field({
      type: String,
      unique: true,
      optional: true,
      sparse: true,
    }),
    chatStatus: field({
      type: UserChatStatus,
      optional: true,
      label: 'Stav uživatelského chatu /používá se pro shq/',
    }),
  }),
);
