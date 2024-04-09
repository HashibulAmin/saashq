module.exports = {
  srcDir: __dirname,
  name: 'clientportal',
  port: 3015,
  scope: 'clientportal',
  exposes: {
    './routes': './src/routes.tsx',
    './cardDetailAction': './src/containers/comments/CardDetailAction.tsx',
    './fieldConfig': './src/containers/FieldConfigForm.tsx',
    './vendorSection': './src/containers/cardsRightSidebarSection/VendorSection.tsx',
    './clientSection': './src/containers/cardsRightSidebarSection/ClientSection.tsx',
  },
  cardDetailAction: './cardDetailAction',
  fieldConfig: './fieldConfig',
  routes: {
    url: 'http://localhost:3015/remoteEntry.js',
    scope: 'clientportal',
    module: './routes'
  },
  menus: [
    {
      text: 'Obchodní portál',
      to: '/settings/business-portal',
      image: '/images/icons/saashq-32.png',
      location: 'settings',
      scope: 'businessportal',
      action: '',
      permissions: []
    }
  ],

  ticketRightSidebarSection: [
    {
      text: "sekce prodejce",
      component: "./vendorSection",
      scope: "clientportal"
    },
    {
      text: "klientská sekce",
      component: "./clientSection",
      scope: "clientportal"
    }
  ],
  taskRightSidebarSection: [
    {
      text: "sekce prodejce",
      component: "./vendorSection",
      scope: "clientportal"
    },
    {
      text: "klientská sekce",
      component: "./clientSection",
      scope: "clientportal"
    }
  ],
  dealRightSidebarSection: [
    {
      text: "sekce prodejce",
      component: "./vendorSection",
      scope: "clientportal"
    },
    {
      text: "klientská sekce",
      component: "./clientSection",
      scope: "clientportal"
    }
  ]
};
