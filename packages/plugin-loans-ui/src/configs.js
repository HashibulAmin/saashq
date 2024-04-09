module.exports = {
  srcDir: __dirname,
  name: 'loans',
  port: 3119,
  exposes: {
    './routes': './src/routes.tsx',
    // './settings': './src/Settings.tsx',
    './contractSection': './src/contracts/components/common/ContractSection.tsx'
  },
  routes: {
    url: 'http://localhost:3119/remoteEntry.js',
    scope: 'loans',
    module: './routes'
  },
  menus: [
    {
      text: 'Smlouva o půjčce',
      url: '/saashq-plugin-loan/contract-list',
      icon: 'icon-medal',
      location: 'mainNavigation',
      permissions: ['showContracts'],
      permission: 'showContracts'
    },
    {
      text: 'Typy smluv',
      image: '/images/icons/saashq-01.svg',
      to: '/saashq-plugin-loan/contract-types/',
      action: 'loanConfig',
      scope: 'loans',
      location: 'settings',
      permissions: ['showContracts'],
      permission: 'showContracts'
    },
    {
      text: 'Typy pojištění',
      image: '/images/icons/saashq-13.svg',
      to: '/saashq-plugin-loan/insurance-types/',
      action: 'loanConfig',
      scope: 'loans',
      location: 'settings',
      permissions: ['manageInsuranceTypes'],
      permission: 'manageInsuranceTypes'
    },
    {
      text: 'Konfigurace půjčky',
      image: '/images/icons/saashq-16.svg',
      to: '/saashq-plugin-loan/holiday-settings/',
      action: 'loanConfig',
      scope: 'loans',
      location: 'settings',
      permissions: ['manageLoanConfigs'],
      permission: 'manageLoanConfigs'
    },
    {
      text: 'Transakce',
      image: '/images/icons/saashq-16.svg',
      to: '/saashq-plugin-loan/transaction-list',
      action: 'transaction',
      scope: 'loans',
      location: 'transaction-list',
      permissions: ['showTransactions']
    }
  ],
  customerRightSidebarSection: [
    {
      text: 'Sekce pravého bočního panelu zákazníka',
      component: './contractSection',
      scope: 'loans'
    }
  ],
  companyRightSidebarSection: [
    {
      text: 'Sekce pravého bočního panelu společnosti',
      component: './contractSection',
      scope: 'loans'
    }
  ],
  dealRightSidebarSection: [
    {
      text: 'nabídka Pravý postranní panel',
      component: './contractSection',
      scope: 'loans'
    }
  ]
};
