export const GENERAL_SETTINGS = [
  {
    name: 'Obecné nastavení',
    text: 'Konfigurace systému',
    icon: 'icon-settings',
    url: '/settings/general',
  },
  {
    name: 'Obecné nastavení',
    text: 'Oprávnění',
    icon: 'icon-settings',
    url: '/settings/permissions',
  },
  {
    name: 'Obecné nastavení',
    text: 'Členové týmu',
    icon: 'icon-settings',
    url: '/settings/team',
  },
  {
    name: 'Obecné nastavení',
    text: 'Značky',
    icon: 'icon-settings',
    url: '/settings/brands',
  },
  {
    name: 'Obecné nastavení',
    text: 'Import & Export',
    icon: 'icon-settings',
    url: '/settings/selectMenu',
  },
  {
    name: 'Obecné nastavení',
    text: 'Aplikace',
    icon: 'icon-settings',
    url: '/settings/apps',
  },
];

export const ACTIONS = [
  {
    name: 'Akce',
    text: 'Přidat značku',
    icon: 'icon-plus',
    url: '/settings/brands#showBrandAddModal=true',
  },
  {
    name: 'Akce',
    text: 'Přidat oprávnění',
    icon: 'icon-plus',
    url: '/settings/permissions#showUserGroupAddModal=true',
  },
  {
    name: 'Akce',
    text: 'Přidat člena týmu',
    icon: 'icon-plus',
    url: '/settings/team#showMemberInviteModal=true',
  },
  {
    name: 'Akce',
    text: 'Nový Email',
    icon: 'icon-plus',
    url: '#',
    type: 'email',
  },
];
