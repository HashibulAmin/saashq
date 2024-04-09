module.exports = {
  srcDir: __dirname,
  name: 'forum',
  port: 3019,
  scope: 'forum',
  exposes: {
    './routes': './src/routes.tsx',
    './settings': './src/Settings.tsx',
  },
  routes: {
    url: 'http://localhost:3019/remoteEntry.js',
    scope: 'forum',
    module: './routes'
  },
  menus: [
    {
      text: 'Fóra',
      url: '/forums',
      icon: 'icon-idea',
      location: 'mainNavigation',
      // scope: 'forum'
    },
    {
      text: 'Kategorie',
      to: '/forums/categories',
      image: '/images/icons/saashq-18.svg',
      location: 'settings',
      scope: 'forum',
      action: '',
      permissions: [],
    },
    {
      text: 'Skupiny oprávnění',
      to: '/forums/permission-groups',
      image: '/images/icons/saashq-18.svg',
      location: 'settings',
      scope: 'forum',
      action: '',
      permissions: [],
    },
    {
      text: 'Předplatné produkty',
      to: '/forums/subscription-products',
      image: '/images/icons/saashq-18.svg',
      location: 'settings',
      scope: 'forum',
      action: '',
      permissions: [],
    },
  ]
};