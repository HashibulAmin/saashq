module.exports = {
  payments: {
    name: 'payments',
    description: 'Payments',
    actions: [
      {
        name: 'paymentsAll',
        description: 'Všechno',
        use: [
          'paymentAdd',
          'paymentEdit',
          'paymentRemove',
          'showPayments',
        ],
      },
      {
        name: 'paymentAdd',
        description: 'Add payments',
      },
      {
        name: 'paymentEdit',
        description: 'Edit payments',
      },
      {
        name: 'paymentRemove',
        description: 'Remove payments',
      },
      {
        name: 'showPayments',
        description: 'Show payments',
      },
    ],
  },
  invoices: {
    name: 'invoices',
    description: 'Invoices',
    actions: [
      {
        name: 'invoicesAll',
        description: 'Všechno',
        use: [
          'showInvoices',
          'createInvoice'
        ],
      },
      {
        name: 'showInvoices',
        description: 'Show invoices',
      },
      {
        name: 'createInvoice',
        description: 'Create invoice',
      },
    ],
  },
};
