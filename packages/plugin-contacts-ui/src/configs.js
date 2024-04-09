module.exports = {
  srcDir: __dirname,
  name: 'contacts',
  port: 3011,
  scope: 'contacts',
  exposes: {
    './routes': './src/routes.tsx',
    './activityLog': './src/activityLogs/activityLog.tsx',
    './automation': './src/automations/automation.tsx',
    './contactDetailHeader': './src/customers/containers/LeadState',
    './selectRelation': './src/relation/SelectRelation.tsx'
  },
  routes: {
    url: 'http://localhost:3011/remoteEntry.js',
    scope: 'contacts',
    module: './routes'
  },
  activityLog: './activityLog',
  automation: './automation',
  selectRelation: './selectRelation',
  contactDetailHeader: './contactDetailHeader',
  menus: [
    {
      text: 'Kontakty',
      url: '/contacts/customer',
      icon: 'icon-users',
      location: 'mainNavigation',
      permission: 'showCustomers'
    }
  ]
};
