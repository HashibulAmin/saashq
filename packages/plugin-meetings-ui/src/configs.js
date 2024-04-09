module.exports = {
  srcDir: __dirname,
  name: 'meetings',
  port: 3017,
  scope: 'meetings',
  exposes: {
    './routes': './src/routes.tsx',
    './meetingSideBarSection': './src/DealRoute.tsx'
  },
  routes: {
    url: 'http://localhost:3017/remoteEntry.js',
    scope: 'meetings',
    module: './routes'
  },
  menus: [
    {
      text: 'Setkání',
      url: '/meetings/myCalendar',
      icon: 'icon-calender',
      location: 'mainNavigation'
    }
  ],
  dealRightSidebarSection: [
    {
      text: 'schůze sekce',
      component: './meetingSideBarSection',
      scope: 'meetings'
    }
  ]
};
