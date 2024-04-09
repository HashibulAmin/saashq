module.exports = {
  srcDir: __dirname,
  name: 'logs',
  port: 3040,
  scope: 'logs',
  exposes: {
    './routes': './src/routes.tsx',
    './contactDetailContent': './src/logs/Activities.tsx'
  },
  routes: {
    url: 'http://localhost:3040/remoteEntry.js',
    scope: 'logs',
    module: './routes'
  },
  contactDetailContent: './contactDetailContent',
  menus: [
    {
      text: 'Systémové protokoly',
      to: '/settings/logs',
      image: '/images/icons/saashq-33.png',
      location: 'settings',
      scope: 'logs',
      component: './settings',
      action: '',
      permissions: []
    },
    {
      text: 'Záznamy o doručení e-mailu',
      to: '/settings/emailDelivery',
      image: '/images/icons/saashq-27.png',
      location: 'settings',
      scope: 'logs',
      component: './settings',
      action: '',
      permissions: []
    }
  ]
};
