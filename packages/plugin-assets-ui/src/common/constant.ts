import { __ } from '@saashq/ui/src';

export const ASSET_CATEGORY_STATUSES = [
  { label: 'Zvolte Stav', value: '' },
  { label: 'Aktivní', value: 'active' },
  { label: 'Zakázáno', value: 'disabled' },
  { label: 'Archivováno', value: 'archived' },
];

export const ASSET_INFO = {
  name: 'Název',
  type: 'Typ',
  category: 'kategorie',
  parent: 'rodič',
  code: 'Kód',
  description: 'Popis',
  unitPrice: 'Jednotková cena',
  vendor: 'Prodejce',

  ALL: [
    { field: 'name', label: 'Název' },
    { field: 'type', label: 'Typ' },
    { field: 'category', label: 'Kategorie' },
    { field: 'parent', label: 'Rodič' },
    { field: 'code', label: 'Kód' },
    { field: 'description', label: 'Popis' },
    { field: 'unitPrice', label: 'Jednotková cena' },
    { field: 'vendor', label: 'Prodejce' },
  ],
};

export const ASSET_CATEGORY_STATUS_FILTER = {
  disabled: 'Zakázáno',
  archived: 'Archivováno',
};

export const breadcrumb = [
  { title: __('Nastavení'), link: '/settings' },
  { title: __('Aktiva') },
];

export const menuMovements = [
  { title: 'Pohyby', link: '/asset-movements' },
  { title: 'Aktiva', link: '/asset-movement-items' },
];

export const checkKnowledge = [
  {
    title: 'Zadáno',
    label: 'Přiřazená Znalostní báze',
    icon: 'file-bookmark-alt',
  },
  {
    title: 'Designated',
    label: 'Určená Znalostní báze',
    icon: 'file-times',
  },
];
