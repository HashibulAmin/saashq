module.exports = {
  srcDir: __dirname,
  name: 'block',
  port: 3017,
  scope: 'block',
  exposes: {
    './routes': './src/routes.tsx',
    './customerSidebar': './src/containers/CustomerSideBar.tsx',
    './activityLog': './src/activityLogs/activityLog.tsx'
  },
  routes: {
    url: 'http://localhost:3017/remoteEntry.js',
    scope: 'block',
    module: './routes'
  },

  activityLog: './activityLog',
  menus: [
    {
      text: 'Bloky',
      to: '/block/list',
      image: '/images/icons/saashq-18.svg',
      location: 'settings'
    }
  ],
  customerRightSidebarSection: [
    {
      text: 'Zákaznická sekce',
      component: './customerSidebar',
      scope: 'block'
    }
  ]
};
