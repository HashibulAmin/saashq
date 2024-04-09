module.exports = {
  srcDir: __dirname,
  name: 'automations',
  port: 3008,
  scope: 'automations',
  exposes: {
    './routes': './src/routes.tsx',
    './activityLog': './src/activityLogs/index.tsx'
  },
  routes: {
    url: 'http://localhost:3008/remoteEntry.js',
    scope: 'automations',
    module: './routes'
  },
  activityLog: './activityLog',
  menus: [
    {
      text: 'Automatizace',
      url: '/automations',
      location: 'mainNavigation',
      icon: 'icon-circular',
      permission: 'showAutomations'
    },
    {
      text: 'Konfigurace automatizace',
      to: '/settings/automations/general',
      image: '/images/icons/saashq-14.svg',
      location: 'settings',
      scope: 'automations'
    }
  ]
};
