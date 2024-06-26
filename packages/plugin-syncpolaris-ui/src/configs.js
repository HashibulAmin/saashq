module.exports = {
  srcDir: __dirname,
  name: 'syncpolaris',
  port: 3037,
  scope: 'syncpolaris',
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3037/remoteEntry.js',
    scope: 'syncpolaris',
    module: './routes'
  },
  menus:[
    {
      text: 'Konfigurace synchronizace polaris',
      to: '/saashq-plugin-sync-polaris/settings/general',
      image: '/images/icons/saashq-04.svg',
      location: "settings",
      scope: "syncpolaris",
      action: 'syncPolarisonfig',
      permission: "syncPolarisConfig",
    },
    {
      "text":"Sync Polariss",
      "url":"/sync-polaris-history",
      "icon":"icon-star",
      "location":"mainNavigation"
    },
    
  ]
};
