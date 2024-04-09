import { companySchema } from './models/definitions/companies';
import {
  customerSchema,
  locationSchema,
  visitorContactSchema,
} from './models/definitions/customers';

export const MODULE_NAMES = {
  COMPANY: 'společnost',
  CUSTOMER: 'zákazník',
};

export const COC_LEAD_STATUS_TYPES = [
  '',
  'Nový',
  'OTEVŘENO',
  'probíhá',
  'otevřít dohodu',
  'nekvalifikovaný',
  'se pokusili kontaktovat',
  'připojeno',
  'špatné načasování',
];

export const COC_LIFECYCLE_STATE_TYPES = [
  '',
  'odběratel',
  'Vést',
  'marketing kvalifikovaný vedoucí',
  'prodeje kvalifikovaný vedoucí',
  'příležitost',
  'zákazník',
  'evangelista',
  'jiný',
];

export const IMPORT_EXPORT_TYPES = [
  {
    text: 'Zákazníci',
    contentType: 'customer',
    icon: 'users-alt',
  },
  {
    text: 'Vede',
    contentType: 'lead',
    icon: 'file-alt',
  },
  {
    text: 'Společnosti',
    contentType: 'company',
    icon: 'building',
  },
];

export const CUSTOMER_BASIC_INFOS = [
  'Stát',
  'jméno',
  'příjmení',
  'prostřední jméno',
  'Primární email',
  'e-maily',
  'hlavní telefon',
  'telefony',
  'ownerId',
  'pozice',
  'oddělení',
  'leadStatus',
  'postavení',
  'hasAuthority',
  'popis',
  'je přihlášeno',
  'integrationId',
  'kód',
  'mergedIds',
];

export const COMPANY_BASIC_INFOS = [
  'primaryName',
  'jména',
  'velikost',
  'průmysl',
  'webová stránka',
  'plán',
  'Primární email',
  'hlavní telefon',
  'businessType',
  'popis',
  'je přihlášeno',
  'id mateřské společnosti',
];
export const LOG_MAPPINGS = [
  {
    name: MODULE_NAMES.COMPANY,
    schemas: [companySchema],
  },
  {
    name: MODULE_NAMES.CUSTOMER,
    schemas: [customerSchema, locationSchema, visitorContactSchema],
  },
];

export const EMAIL_VALIDATION_STATUSES = {
  VALID: 'platný',
  INVALID: 'neplatný',
  ACCEPT_ALL_UNVERIFIABLE: 'přijmout_vše_neověřitelné',
  UNVERIFIABLE: 'neověřitelné',
  UNKNOWN: 'neznámý',
  DISPOSABLE: 'jednorázový',
  CATCH_ALL: 'úlovek',
  BAD_SYNTAX: 'špatná syntaxe',
};

export const AWS_EMAIL_STATUSES = {
  SEND: 'poslat',
  DELIVERY: 'dodávka',
  OPEN: 'otevřít',
  CLICK: 'klikněte',
  COMPLAINT: 'stížnost',
  BOUNCE: 'odskočit',
  RENDERING_FAILURE: 'selhání vykreslování',
  REJECT: 'odmítnout',
};
export const CUSTOMER_BASIC_INFO = {
  avatar: 'Avatar',
  firstName: 'Jméno',
  lastName: 'Příjmení',
  middleName: 'Prostřední jméno',
  primaryEmail: 'Primární email',
  primaryPhone: 'hlavní telefon',
  position: 'Pozice',
  department: 'oddělení',
  owner: 'Majitel',
  pronoun: 'Zájmeno',
  birthDate: 'Narozeniny',
  hasAuthority: 'Má autoritu',
  description: 'Popis',
  isSubscribed: 'Odebíráno',
  code: 'Kód',
  score: 'Skóre',

  ALL: [
    { field: 'avatar', label: 'Avatar', canHide: false },
    { field: 'firstName', label: 'Jméno', canHide: false },
    { field: 'lastName', label: 'Příjmení', canHide: false },
    { field: 'middleName', label: 'Prostřední jméno', canHide: false },
    {
      field: 'primaryEmail',
      label: 'Primární email',
      validation: 'email',
      canHide: false,
    },
    {
      field: 'primaryPhone',
      label: 'hlavní telefon',
      validation: 'phone',
      canHide: false,
    },
    { field: 'position', label: 'Pozice', canHide: true },
    { field: 'department', label: 'oddělení', canHide: true },
    { field: 'hasAuthority', label: 'Má autoritu', canHide: true },
    { field: 'description', label: 'Popis', canHide: true },
    { field: 'isSubscribed', label: 'Odebíráno', canHide: true },
    { field: 'owner', label: 'Majitel', canHide: true },
    { field: 'pronoun', label: 'Zájmeno', canHide: true },
    { field: 'birthDate', label: 'Narozeniny', canHide: true },
    { field: 'code', label: 'Kód', canHide: true },
    { field: 'score', label: 'Skóre', canHide: true },
  ],
};

export const COMPANY_INFO = {
  avatar: 'Emblém',
  code: 'Kód',
  primaryName: 'Primární jméno',
  size: 'Velikost',
  industry: 'Průmyslová odvětví',
  plan: 'Plán',
  primaryEmail: 'Primární email',
  primaryPhone: 'hlavní telefon',
  businessType: 'Typ podnikání',
  description: 'Popis',
  isSubscribed: 'Odebíráno',
  location: 'Země ústředí',
  score: 'Skóre',

  ALL: [
    { field: 'avatar', label: 'Emblém', canHide: false },
    { field: 'primaryName', label: 'Primární jméno', canHide: false },
    {
      field: 'primaryEmail',
      label: 'Primární email',
      validation: 'email',
      canHide: false,
    },
    {
      field: 'primaryPhone',
      label: 'hlavní telefon',
      validation: 'phone',
      canHide: false,
    },
    { field: 'size', label: 'Velikost' },
    { field: 'industry', label: 'Průmyslová odvětví' },
    { field: 'plan', label: 'Plán' },
    { field: 'owner', label: 'Majitel', canHide: true },
    { field: 'businessType', label: 'Typ podnikání', canHide: true },
    { field: 'code', label: 'Kód', canHide: true },
    { field: 'description', label: 'Popis', canHide: true },
    { field: 'isSubscribed', label: 'Odebíráno', canHide: true },
    { field: 'location', label: 'Země ústředí', canHide: true },
    { field: 'score', label: 'Skóre', canHide: true },
  ],
};

export const DEVICE_PROPERTIES_INFO = {
  location: 'Umístění',
  browser: 'Prohlížeč',
  platform: 'Plošina',
  ipAddress: 'IP adresa',
  hostName: 'Název hostitele',
  language: 'Jazyk',
  agent: 'uživatelský agent',
  ALL: [
    { field: 'location', label: 'Umístění' },
    { field: 'browser', label: 'Prohlížeč' },
    { field: 'platform', label: 'Plošina' },
    { field: 'ipAddress', label: 'IP adresa' },
    { field: 'hostName', label: 'Název hostitele' },
    { field: 'language', label: 'Jazyk' },
    { field: 'agent', label: 'uživatelský agent' },
  ],
};

export const NOTIFICATION_MODULES = [
  {
    name: 'customers',
    description: 'Zákazníci',
    icon: 'user',
    types: [
      {
        name: 'customerMention',
        text: 'Uveďte v poznámce zákazníka',
      },
    ],
  },
  {
    name: 'companies',
    description: 'Společnosti',
    icon: 'building',
    types: [
      {
        name: 'companyMention',
        text: 'Uveďte ve firemní poznámce',
      },
    ],
  },
];
