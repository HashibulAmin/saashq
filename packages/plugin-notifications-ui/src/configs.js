module.exports = {
  srcDir: __dirname,
  name: 'notifications',
  port: 3014,
  scope: 'notifications',
  exposes: {
    './routes': './src/routes.tsx',
    './settings': './src/containers/Widget.tsx',
    './automation': './src/automations/index.tsx'
  },
  routes: {
    url: 'http://localhost:3014/remoteEntry.js',
    scope: 'notifications',
    module: './routes'
  },
  automation: './automation',
  menus: [
    {
      text: 'oznámení',
      url: '/notifications',
      icon: 'icon-book-open',
      location: 'topNavigation',
      scope: 'notifications',
      component: './settings'
    },
    {
      text: 'Konfigurace oznámení',
      to: '/settings/notifications',
      image: '/images/icons/saashq-11.svg',
      location: 'settings',
      scope: 'notifications'
    }
  ]
};
