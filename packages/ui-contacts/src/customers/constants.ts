import { getConstantFromStore } from '@saashq/ui/src/utils';

export const LEAD_CHOICES = [
  { label: 'Nový', value: 'new' },
  { label: 'Kontaktováno', value: 'attemptedToContact' },
  { label: 'Pracovní', value: 'inProgress' },
  { label: 'Špatné načasování', value: 'badTiming' },
  { label: 'Nekvalifikovaný', value: 'unqualified' },
];

export const CUSTOMER_BASIC_INFO = {
  avatar: 'Avatar',
  firstName: 'Jméno',
  lastName: 'Příjmení',
  primaryEmail: 'Primární Email',
  primaryPhone: 'Hlavní Telefon',
  position: 'Pozice',
  department: 'Oddělení',
  hasAuthority: 'Má Autoritu',
  description: 'Popis',
  isSubscribed: 'Odebíráno',

  ALL: [
    { field: 'avatar', label: 'Avatar' },
    { field: 'firstName', label: 'Jméno' },
    { field: 'middleName', label: 'Prostřední Jméno' },
    { field: 'lastName', label: 'Příjmení' },
    { field: 'primaryEmail', label: 'Primární Email' },
    { field: 'primaryPhone', label: 'Hlavní Telefon' },
    { field: 'position', label: 'Pozice' },
    { field: 'department', label: 'Oddělení' },
    { field: 'hasAuthority', label: 'Má Autoritu' },
    { field: 'description', label: 'Popis' },
    { field: 'isSubscribed', label: 'Odebíráno' },
  ],
};

export const CUSTOMER_DATAS = {
  visitorContactInfo: 'Kontaktní údaje návštěvníka',
  owner: 'Majitel',
  links: 'Odkazy',

  ALL: [
    { field: 'visitorContactInfo', label: 'Kontaktní údaje návštěvníka' },
    { field: 'owner', label: 'Majitel' },
    { field: 'links', label: 'Odkazy' },
  ],
};

export const CUSTOMER_LINKS = {
  linkedIn: 'LinkedIn',
  twitter: 'Twitter',
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'Youtube',
  github: 'Github',
  website: 'Webová stránka',

  ALL: [
    { field: 'linkedIn', label: 'LinkedIn' },
    { field: 'twitter', label: 'Twitter' },
    { field: 'facebook', label: 'Facebook' },
    { field: 'instagram', label: 'Instagram' },
    { field: 'youtube', label: 'Youtube' },
    { field: 'github', label: 'Github' },
    { field: 'website', label: 'Webová stránka' },
  ],
};

export const LEAD_STATUS_TYPES = {
  new: 'Nový',
  attemptedToContact: 'Kontaktováno',
  inProgress: 'Pracovní',
  badTiming: 'Špatné načasování',
  unqualified: 'Nekvalifikovaný',
};

export const GENDER_TYPES = () => getConstantFromStore('sex_choices', true);

export const EMAIL_VALIDATION_STATUSES = [
  { label: 'Platný', value: 'valid' },
  { label: 'Neplatný', value: 'invalid' },
  { label: 'Přijměte vše neověřitelné', value: 'accept_all_unverifiable' },
  { label: 'Neznámý', value: 'unknown' },
  { label: 'Jednorázový', value: 'disposable' },
  { label: 'Catchall', value: 'catchall' },
  { label: 'Špatná syntaxe', value: 'badsyntax' },
  { label: 'Neověřitelné', value: 'unverifiable' },
  { label: 'Nekontrolováno', value: 'Not checked' },
];

export const PHONE_VALIDATION_STATUSES = [
  { label: 'Platný', value: 'valid' },
  { label: 'Neplatný', value: 'invalid' },
  { label: 'Neznámý', value: 'unknown' },
  { label: 'Neověřitelné', value: 'unverifiable' },
  { label: 'Mobilní telefon', value: 'receives_sms' },
];

export const CUSTOMER_STATE_OPTIONS = [
  { label: 'Zákazník', value: 'customer' },
  { label: 'Vést', value: 'lead' },
];
