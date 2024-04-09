module.exports = {
  srcDir: __dirname,
  name: 'grants',
  port: 3029,
  scope: 'grants',
  exposes: {
    './routes': './src/routes.tsx',
    './cardSideBarSection': './src/section/containers/Section.tsx'
  },
  routes: {
    url: 'http://localhost:3029/remoteEntry.js',
    scope: 'grants',
    module: './routes'
  },
  menus: [
    {
      text: 'Granty',
      url: '/grants/requests',
      icon: 'icon-followers',
      location: 'mainNavigation'
    },
    {
      text: 'Uděluje konfigurace',
      to: '/settings/grants-configs',
      image: '/images/icons/saashq-18.svg',
      location: 'settings',
      scope: 'grants'
    }
  ],
  dealRightSidebarSection: [
    {
      text: 'sekce grantů',
      component: './cardSideBarSection',
      scope: 'grants',
      withDetail: true
    }
  ],
  ticketRightSidebarSection: [
    {
      text: 'sekce grantů',
      component: './cardSideBarSection',
      scope: 'grants',
      withDetail: true
    }
  ],
  taskRightSidebarSection: [
    {
      text: 'sekce grantů',
      component: './cardSideBarSection',
      scope: 'grants',
      withDetail: true
    }
  ]
};
