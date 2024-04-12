export const USER_PROPERTIES_INFO = {
  email: 'Primary email',
  username: 'User name',
  ALL: [
    { field: 'email', label: 'Primární email', canHide: false },
    { field: 'username', label: 'Uživatelské jméno' },
  ],
};

export const STRUCTURE_STATUSES = {
  ACTIVE: 'active',
  DELETED: 'deleted',
};

export const USER_MOVEMENT_STATUSES = {
  CREATED: 'created',
  REMOVED: 'removed',
};

export const USER_EXTENDED_FIELDS = [
  {
    _id: Math.random(),
    name: 'departments',
    label: 'Oddělení',
    type: 'string',
  },
  {
    _id: Math.random(),
    name: 'branches',
    label: 'Větve',
    type: 'string',
  },
  {
    _id: Math.random(),
    name: 'password',
    label: 'Heslo',
    type: 'string',
  },
];

export const USER_EXPORT_EXTENDED_FIELDS = [
  {
    _id: Math.random(),
    name: 'departments',
    label: 'Oddělení',
    type: 'string',
  },
  {
    _id: Math.random(),
    name: 'branches',
    label: 'Větve',
    type: 'string',
  },
  {
    _id: Math.random(),
    name: 'employeeId',
    label: 'ID zaměstnance',
    type: 'string',
  },
];
