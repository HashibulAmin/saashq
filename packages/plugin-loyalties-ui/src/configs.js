module.exports = {
  srcDir: __dirname,
  name: 'loyalties',
  port: 3002,
  scope: 'loyalties',
  exposes: {
    './routes': './src/routes.tsx',
    './customerSidebar': './src/containers/CustomerSidebar.tsx',
    './companySidebar': './src/containers/CompanySidebar.tsx',
    './userSidebar': './src/containers/UserSidebar.tsx',
    './automation': './src/automations/automation.tsx',
  },
  routes: {
    url: 'http://localhost:3002/remoteEntry.js',
    scope: 'loyalties',
    module: './routes',
  },
  automation: './automation',
  menus: [
    {
      text: 'Loajalita',
      url: '/vouchers',
      icon: 'icon-piggybank',
      location: 'mainNavigation',
      permission: 'showLoyalties',
    },
    {
      text: 'Konfigurace loajalit',
      to: '/saashq-plugin-loyalty/settings/general',
      image: '/images/icons/saashq-16.svg',
      location: 'settings',
      scope: 'loyalties',
      action: 'loyaltyConfig',
      permissions: ['manageLoyalties', 'showLoyalties'],
    },
  ],
  customerRightSidebarSection: [
    {
      text: 'zákaznická sekce',
      component: './customerSidebar',
      scope: 'loyalties',
    },
  ],
  companyRightSidebarSection: [
    {
      text: 'firemní sekce',
      component: './companySidebar',
      scope: 'loyalties',
    },
  ],
  userRightSidebarSection: [
    {
      text: 'uživatelská sekce',
      component: './userSidebar',
      scope: 'loyalties',
    },
  ],
};
