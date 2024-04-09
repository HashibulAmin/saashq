module.exports = {
  srcDir: __dirname,
  name: 'multierkhet',
  port: 3030,
  exposes: {
    './routes': './src/routes.tsx',
    "./response": "./src/response.tsx"
  },
  routes: {
    url: 'http://localhost:3030/remoteEntry.js',
    scope: 'multierkhet',
    module: './routes'
  },
  menus: [
    {
      text: 'Synchronizace Multi Erkhet',
      to: '/saashq-plugin-multi-erkhet/settings/general',
      image: '/images/icons/saashq-04.svg',
      location: "settings",
      scope: "multierkhet",
      action: 'multiErkhetConfig',
      permission: "multiErkhetConfig",
    },
    {
      text: 'Synchronizace Multi Erkhet',
      url: '/multi-erkhet-history',
      icon: 'icon-file-check-alt',
      location: "mainNavigation",
      scope: 'multierkhet',
      permission: 'multiErkhetConfig',
    },
  ],
  layout: {
    url: "http://localhost:3030/remoteEntry.js",
    scope: "multierkhet",
    module: "./response"
  }
};
