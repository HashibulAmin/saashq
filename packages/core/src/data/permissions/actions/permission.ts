export const moduleObjects = {
  brands: {
    name: 'brands',
    description: 'Značky',
    actions: [
      {
        name: 'brandsAll',
        description: 'Všechno',
        use: ['showBrands', 'manageBrands', 'exportBrands', 'removeBrands'],
      },
      {
        name: 'manageBrands',
        description: 'Správa značek',
      },
      {
        name: 'showBrands',
        description: 'Zobrazit značky',
      },
      {
        name: 'exportBrands',
        description: 'Exportní značky',
      },
      {
        name: 'removeBrands',
        description: 'Odstraňte značky',
      },
    ],
  },
  permissions: {
    name: 'permissions',
    description: 'Konfigurace oprávnění',
    actions: [
      {
        name: 'permissionsAll',
        description: 'Všechno',
        use: [
          'managePermissions',
          'showPermissions',
          'showPermissionModules',
          'showPermissionActions',
          'exportPermissions',
        ],
      },
      {
        name: 'managePermissions',
        description: 'Spravovat oprávnění',
      },
      {
        name: 'showPermissions',
        description: 'Zobrazit oprávnění',
      },
      {
        name: 'showPermissionModules',
        description: 'Zobrazit moduly oprávnění',
      },
      {
        name: 'showPermissionActions',
        description: 'Zobrazit akce oprávnění',
      },
      {
        name: 'exportPermissions',
        description: 'Exportní oprávnění',
      },
    ],
  },
  usersGroups: {
    name: 'usersGroups',
    description: 'Skupiny uživatelů',
    actions: [
      {
        name: 'usersGroupsAll',
        description: 'Všechno',
        use: ['showUsersGroups', 'manageUsersGroups'],
      },
      {
        name: 'manageUsersGroups',
        description: 'Správa skupin uživatelů',
      },
      {
        name: 'showUsersGroups',
        description: 'Zobrazit skupiny uživatelů',
      },
    ],
  },
  users: {
    name: 'users',
    description: 'Členové týmu',
    actions: [
      {
        name: 'usersAll',
        description: 'Všechno',
        use: [
          'showUsers',
          'usersEdit',
          'usersInvite',
          'usersSetActiveStatus',
          'exportUsers',
        ],
      },
      {
        name: 'showUsers',
        description: 'Zobrazit členy týmu',
      },
      {
        name: 'usersSetActiveStatus',
        description: 'Nastavit aktivního/deaktivního člena týmu',
      },
      {
        name: 'usersEdit',
        description: 'Aktualizujte člena týmu',
      },
      {
        name: 'usersInvite',
        description: 'Pozvat člena týmu',
      },
      {
        name: 'exportUsers',
        description: 'Export členů týmu',
      },
    ],
  },
  importHistories: {
    name: 'importHistories',
    description: 'Historie importu',
    actions: [
      {
        name: 'importHistoriesAll',
        description: 'Všechno',
        use: ['importHistories', 'removeImportHistories', 'importXlsFile'],
      },
      {
        name: 'importXlsFile',
        description: 'Import souborů xls',
      },
      {
        name: 'removeImportHistories',
        description: 'Odebrat historii importu',
      },
      {
        name: 'importHistories',
        description: 'Zobrazit historii importu',
      },
    ],
  },
  generalSettings: {
    name: 'generalSettings',
    description: 'Obecné nastavení',
    actions: [
      {
        name: 'generalSettingsAll',
        description: 'Všechno',
        use: ['manageGeneralSettings', 'showGeneralSettings'],
      },
      {
        name: 'showGeneralSettings',
        description: 'Zobrazit obecná nastavení',
      },
      {
        name: 'manageGeneralSettings',
        description: 'Spravujte obecná nastavení',
      },
    ],
  },
  structures: {
    name: 'structures',
    description: 'Struktura',
    actions: [
      {
        name: 'structuresAll',
        description: 'Všechno',
        use: [
          'showStructure',
          'addStructure',
          'editStructure',
          'removeStructure',
        ],
      },
      {
        name: 'showStructure',
        description: 'Ukažte strukturu',
      },
      {
        name: 'addStructure',
        description: 'Vytvořte strukturu',
      },
      {
        name: 'editStructure',
        description: 'Upravit strukturu',
      },
      {
        name: 'removeStructure',
        description: 'Odstraňte strukturu',
      },
    ],
  },
  departments: {
    name: 'departments',
    description: 'Oddělení',
    actions: [
      {
        name: 'departmentsAll',
        description: 'Všechno',
        use: [
          'addDepartment',
          'showDepartment',
          'editDepartment',
          'removeDepartment',
        ],
      },
      {
        name: 'showDepartment',
        description: 'Ukaž oddělení',
      },
      {
        name: 'addDepartment',
        description: 'Vytvořte oddělení',
      },
      {
        name: 'editDepartment',
        description: 'Upravit oddělení',
      },
      {
        name: 'removeDepartment',
        description: 'Odebrat oddělení',
      },
    ],
  },
  units: {
    name: 'units',
    description: 'Jednotka',
    actions: [
      {
        name: 'unitsAll',
        description: 'Všechno',
        use: ['showUnit', 'addUnit', 'editUnit', 'removeUnit'],
      },
      {
        name: 'showUnit',
        description: 'Zobrazit jednotku',
      },
      {
        name: 'addUnit',
        description: 'Vytvořte jednotku',
      },
      {
        name: 'editUnit',
        description: 'Upravit jednotku',
      },
      {
        name: 'removeUnit',
        description: 'Odstraňte jednotku',
      },
    ],
  },
  branches: {
    name: 'branches',
    description: 'Větev',
    actions: [
      {
        name: 'branchesAll',
        description: 'Všechno',
        use: ['showBranch', 'addBranch', 'editBranch', 'removeBranch'],
      },
      {
        name: 'showBranch',
        description: 'Ukaž větev',
      },
      {
        name: 'addBranch',
        description: 'Vytvořte větev',
      },
      {
        name: 'editBranch',
        description: 'Upravit větev',
      },
      {
        name: 'removeBranch',
        description: 'Odstraňte větev',
      },
    ],
  },
};
