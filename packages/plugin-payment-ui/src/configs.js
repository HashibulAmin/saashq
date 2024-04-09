module.exports = {
  srcDir: __dirname,
  name: 'payment',
  port: 3021,
  scope: 'payment',
  exposes: {
    './routes': './src/routes.tsx',
    './SelectPayments': './src/containers/SelectPayments.tsx',
    "./invoiceSection": "./src/containers/invoice/InvoiceSection.tsx",
    "./paymentConfig": "./src/containers/paymentConfig/Form.tsx",
  },
  routes: {
    url: 'http://localhost:3021/remoteEntry.js',
    scope: 'payment',
    module: './routes'
  },
  selectPayments: './SelectPayments',
  paymentConfig: './paymentConfig',
  conversationDetailSidebar: './invoiceSection',
  menus: [
    {
      text: 'Faktury',
      url: '/payment/invoices',
      icon: 'icon-list',
      location: 'mainNavigation',
      permission: 'showInvoices',
    },
    {
      text: 'Platby',
      to: '/settings/payments',
      image: '/images/icons/saashq-18.svg',
      location: 'settings',
      scope: 'payment',
      action: "paymentsAll",
      permissions: ['showPayments']
    },
  ],
  dealRightSidebarSection: [
    {
      text: "sekce faktur",
      component: "./invoiceSection",
      scope: "payment"
    }
  ]
}
