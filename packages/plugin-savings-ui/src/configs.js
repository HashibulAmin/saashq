module.exports = {
  srcDir: __dirname,
  name: 'savings',
  port: 3120,
  exposes: {
    './routes': './src/routes.tsx',
    './contractSection': './src/contracts/components/common/ContractSection.tsx'
  },
  routes: {
    url: 'http://localhost:3120/remoteEntry.js',
    scope: 'savings',
    module: './routes'
  },
  menus: [
    {
      text: 'Smlouva o uložení',
      url: '/saashq-plugin-saving/contract-list',
      icon: 'icon-piggybank',
      location: 'mainNavigation',
      permissions: ['showContracts'],
      permission: 'showContracts'
    },
    {
      text: 'Ukládání typů smluv',
      image: '/images/icons/saashq-01.svg',
      to: '/saashq-plugin-saving/contract-types/',
      action: 'savingConfig',
      scope: 'savings',
      location: 'settings',
      permissions: ['showContracts'],
      permission: 'showContracts'
    },
    {
      text: 'Ukládání transakce',
      image: '/images/icons/saashq-16.svg',
      to: '/saashq-plugin-saving/transaction-list',
      action: 'transaction',
      scope: 'savings',
      location: 'transaction-list',
      permissions: ['showTransactions']
    }
  ],
  customerRightSidebarSection: [
    {
      text: 'Sekce pravého bočního panelu zákazníka',
      component: './contractSection',
      scope: 'savings'
    }
  ],
};
