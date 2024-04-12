export const ASSET_CATEGORY_STATUSES = {
  ACTIVE: 'active',
  DISABLED: 'disabled',
  ARCHIVED: 'archived',
  ALL: ['active', 'disabled', 'archived'],
};

export const ASSET_STATUSES = {
  ACTIVE: 'active',
  DELETED: 'deleted',
  ALL: ['active', 'deleted'],
};

export const ASSET_INFO = {
  code: 'Code',
  name: 'Name',
  category: 'Category',
  parent: 'Parent',
  vendor: 'Vendor',
  description: 'Description',
  productCount: 'Product count',

  ALL: [
    { field: 'code', label: 'Kód' },
    { field: 'name', label: 'Název' },
    { field: 'category', label: 'Kategorie' },
    { field: 'parent', label: 'Rodič' },
    { field: 'vendor', label: 'Prodejce' },
    { field: 'description', label: 'Popis' },
    { field: 'productCount', label: 'Počet produktů' },
  ],
};

export const ASSET_EXTEND_FIELDS = [
  {
    _id: Math.random(),
    name: 'categoryName',
    label: 'Název Kategorie',
    type: 'string',
  },
  {
    _id: Math.random(),
    name: 'parentName',
    label: 'Jméno rodiče',
    type: 'string',
  },
  {
    _id: Math.random(),
    name: 'parentCode',
    label: 'Rodičovský kód',
    type: 'string',
  },
  {
    _id: Math.random(),
    name: 'tag',
    label: 'Štítek',
    type: 'string',
  },
];

export const ASSETS_MOVEMENT_EXTEND_FIELDS = [
  {
    _id: Math.random(),
    name: 'assetName',
    label: 'Název Díla',
    type: 'string',
  },
  {
    _id: Math.random(),
    name: 'assetCode',
    label: 'Kód Aktiv',
    type: 'string',
  },
  {
    _id: Math.random(),
    name: 'branchName',
    label: 'Jméno Pobočky',
    type: 'string',
  },
  {
    _id: Math.random(),
    name: 'branchCode',
    label: 'Kód Pobočky',
    type: 'string',
  },
  {
    _id: Math.random(),
    name: 'departmentName',
    label: 'Název Oddělení',
    type: 'string',
  },
  {
    _id: Math.random(),
    name: 'departmentCode',
    label: 'Kód Oddělení',
    type: 'string',
  },
  {
    _id: Math.random(),
    name: 'customerEmail',
    label: 'E-mail Zákazníka',
    type: 'string',
  },
  {
    _id: Math.random(),
    name: 'companyEmail',
    label: 'E-mailSspolečnosti',
    type: 'string',
  },
  {
    _id: Math.random(),
    name: 'teamMemberEmail',
    label: 'E-mail člena Týmu',
    type: 'string',
  },
];
