import * as mongoose from 'mongoose';
import { PROMO_CODE_TYPE } from '../saas/constants';

export const ORGANIZATION_PLAN = {
  LIFETIME: 'život',
  FREE: 'uvolnit',
  GROWTH: 'růst',
  ALL: ['život', 'uvolnit', 'růst'],
};

export const INTERVAL = {
  MONTHLY: 'měsíční',
  YEARLY: 'roční',
  ALL: ['měsíční', 'roční'],
};

const cronLastExecutedDateSchema = new mongoose.Schema(
  {
    reset: Date,
    notify: Date,
  },
  { _id: false },
);

export const organizationsSchema = new mongoose.Schema({
  name: { type: String },
  logo: { type: String },
  icon: { type: String },
  iconColor: { type: String },
  textColor: { type: String },
  favicon: { type: String },
  description: { type: String },
  dnsStatus: { type: String },
  backgroundColor: { type: String },
  isWhiteLabel: { type: Boolean, optional: true, default: false },
  domain: { type: String },
  subdomain: { type: String },
  ownerId: { type: String },
  charge: { type: Object },
  promoCodes: { type: [String] },
  partnerKey: { type: String },
  lastActiveDate: { type: Date },
  createdAt: { type: Date },
  plan: {
    type: String,
    enum: ORGANIZATION_PLAN.ALL,
    default: ORGANIZATION_PLAN.FREE,
  },
  interval: { type: String, enum: INTERVAL.ALL, optional: true },
  subscriptionId: { type: String, optional: true },
  expiryDate: { type: Date, label: 'Datum vypršení platnosti', optional: true },
  cronLastExecutedDate: { type: cronLastExecutedDateSchema },
  awsSesAccountStatus: {
    type: String,
    label: 'Stav účtu AWS SES',
    optional: true,
  },
  percentOff: Number,
  amountOff: Number,
  paymentStatus: { type: String },
  paymentStatusMessage: { type: String },
  teamSize: { type: String },
  industry: { type: String },
  annualRevenue: { type: String },
  experienceId: { type: String },
  onboardingDone: { type: Boolean },
  customDomainStatus: { type: Object },

  hostNameStatus: { type: String },
  sslStatus: { type: String },
});

export const installationSchema = new mongoose.Schema({
  createdAt: { type: Date, label: 'Vytvořeno v', default: new Date() },
  userId: { type: String, label: 'Vlastník uživatel' },
  organizationId: { type: String, label: 'Linked organization' },
  name: { type: String, label: 'Název vlastní hostované instalace' },
  token: { type: String, label: 'Žeton' },
  isVerified: { type: Boolean, default: false },
  domain: { type: String, label: 'Vlastní hostovaná doména' },
});

export const paymentSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  organizationId: { type: String },
  amount: { type: Number },
  invoiceId: { type: String },
});

export const userSchema = new mongoose.Schema({
  organizationIds: { type: [String] },
  email: { type: String },
});

export const endPointSchema = new mongoose.Schema({
  endPointUrl: { type: String },
});

export const PROMOCODE_STATUS = {
  REDEEMED: 'vykoupeni',
  REVOKED: 'odvoláno',
  UNUSED: 'nepoužitý',
  ALL: ['vykoupeni', 'odvoláno', 'nepoužitý'],
};

export const promoCodeSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  status: {
    type: String,
    enum: PROMOCODE_STATUS.ALL,
    default: PROMOCODE_STATUS.UNUSED,
  },
  usedBy: { type: String, label: 'Použito uživatelem' },
  usedAt: {
    type: Date,
    label: 'Používá se při',
  },
  type: { type: String, enum: PROMO_CODE_TYPE.ALL },
  createdBy: { type: String, label: 'Vytvořil' },
  createdAt: {
    type: Date,
    default: new Date(),
    label: 'Vytvořeno v',
  },
});

export const PAYMENT_STATUS = {
  INCOMPLETE: 'neúplný',
  ERROR: 'chyba',
  COMPLETE: 'kompletní',
  CANCELED: 'zrušeno',
  ALL: ['zrušeno', 'neúplný', 'kompletní', 'chyba'],
};

export const addonSchema = new mongoose.Schema({
  kind: { type: String, label: 'Druh doplňku' },
  subkind: {
    type: String,
    label: 'Například: Používá se pro službu nastavení',
  },
  quantity: { type: Number, label: 'Množství' },
  unitAmount: { type: Number, label: 'Jednotková částka' },
  installationId: { type: String, label: 'Propojená instalace' },
  subscriptionItemId: {
    type: String,
    label: 'Propojená položka předplatného, ​​pokud byla zakoupena',
  },
  subscriptionId: {
    type: String,
    label: 'Propojené předplatné, pokud bylo zakoupeno',
  },
  expiryDate: { type: Date, label: 'Datum expirace v případě zakoupení' },
  createdUser: { type: String, label: 'Vytvořený uživatel' },
  interval: String,
  percentOff: Number,
  amountOff: Number,
  paymentStatus: {
    type: String,
    enum: PAYMENT_STATUS.ALL,
    label: 'Hodnota bude úplná, pokud bude platba stažena z karty.',
  },
  paymentStatusMessage: {
    type: String,
    label: 'Vysvětlení platby',
  },
});

export const bundleSchema = new mongoose.Schema({
  name: { type: String },
  createdAt: {
    type: Date,
    default: new Date(),
    label: 'Vytvořeno v',
  },
  title: { type: String },
  type: { type: String },
  stripeProductId: { type: String, label: 'ID produktu v pruhu' },
  pluginLimits: {
    type: mongoose.Schema.Types.Mixed,
    label: 'Informace o pluginech',
  },
  comingSoon: {
    type: Boolean,
    label: 'Zobrazit různé věci v uživatelském rozhraní, pokud již brzy',
  },
  isActive: { type: Boolean, label: '' },
  promoCodes: { type: [String], label: 'Propagační kódy' },
  description: { type: String, label: 'Popis' },
  onboardingSteps: { type: [String], label: 'Vstupní kroky' },
  onboardingDescription: { type: String, label: 'Popis registrace' },
  features: { type: String, label: 'Funkce' },
  detailedDescription: { type: String, label: 'Detailní Popis' },
});

const creatorSchema = new mongoose.Schema(
  {
    name: { type: String },
    address: { type: String },
    email: { type: String },
    phone: { type: String },
  },
  { _id: false },
);

export const PLUGIN_MAIN_TYPES = {
  ADDON: 'doplněk',
  PLUGIN: 'zapojit',
  SERVICE: 'servis',
  POWERUP: 'zapnutí napájení',
  ALL: ['doplněk', 'zapojit', 'servis', 'zapnutí napájení'],
};

export const pluginSchema = new mongoose.Schema({
  language: { type: String, label: 'Jazyk' },

  avatar: { type: String, label: 'Avatar' },
  images: { type: String, label: 'Snímky' },
  video: { type: String, label: 'Video' },

  title: { type: String, label: 'Název pluginu' },
  creator: { type: creatorSchema, label: 'Informace o tvůrci' },
  department: { type: String, label: 'Oddělení' },

  description: { type: String, label: 'Popis' },
  shortDescription: { type: String, label: 'Stručný popis' },
  screenShots: { type: String, label: 'Snímky obrazovky' },
  features: { type: String, label: 'Funkce' },

  tango: { type: String, label: 'Tango' },

  changeLog: { type: String, label: 'Změnit protokol' },
  lastUpdatedInfo: { type: String, label: 'Poslední aktualizované informace' },
  contributors: { type: String, label: 'Přispěvatelé' },
  support: { type: String, label: 'Vyřešené problémy' },

  createdAt: { type: Date, label: 'Vytvořeno v' },
  modifiedAt: { type: Date, label: 'Upraveno v' },
  createdBy: { type: String, label: 'Vytvořil' },
  modifiedBy: { type: String, label: 'Upraven' },

  selfHosted: { type: Boolean, label: 'Pro vlastní hostování nebo ne' },
  type: {
    type: String,
    label: 'Hodnota dříve uložená v konstantní proměnné typu položky poplatku',
  },
  limit: { type: Number, label: 'Omezit' },
  count: { type: Number, label: 'Počet' },
  initialCount: { type: Number, label: 'Počáteční počet' },
  growthInitialCount: { type: Number },
  resetMonthly: {
    type: Boolean,
    label: 'Zda se limit resetuje měsíčně nebo ne',
  },
  unit: { type: String, label: 'Měřící jednotka' },
  comingSoon: {
    type: Boolean,
    label: 'Zobrazit různé věci v uživatelském rozhraní, pokud již brzy',
  },
  icon: { type: String, label: 'Cesta ikony' },
  categories: {
    type: [String],
    label: 'Související kategorie (marketing, prodej ... atd.)',
  },
  dependencies: { type: [String], label: 'Závislá ID pluginů' },
  mainType: {
    type: [String],
    label: 'Ať už jde o plugin, addon, službu nebo power-up',
    enum: PLUGIN_MAIN_TYPES.ALL,
  },
  stripeProductId: { type: String, label: 'ID produktu v pruhu' },
});

export const experiencesSchema = new mongoose.Schema({
  title: { type: String },
  images: { type: String, label: 'snímky' },
  video: { type: String, label: 'video' },
  createdAt: {
    type: Date,
    default: new Date(),
    label: 'Vytvořeno v',
  },
  stripeProductId: { type: String, label: 'ID produktu v pruhu' },
  pluginLimits: {
    type: mongoose.Schema.Types.Mixed,
    label: 'Informace o pluginech',
  },
  comingSoon: {
    type: Boolean,
    label: 'Zobrazit různé věci v uživatelském rozhraní, pokud již brzy',
  },
  isPrivate: {
    type: Boolean,
    label: 'Zobrazit různé věci v uživatelském rozhraní, pokud již brzy',
  },
  isActive: { type: Boolean, label: '' },
  promoCodes: { type: [String], label: 'Propagační kódy' },
  description: { type: String, label: 'Popis' },
  onboardingSteps: { type: [String], label: 'Vstupní kroky' },
  onboardingDescription: { type: String, label: 'Popis registrace' },
  features: { type: String, label: 'Funkce' },
});
