module.exports = {
  srcDir: __dirname,
  name: 'syncerkhet',
  port: 3017,
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3017/remoteEntry.js',
    scope: 'syncerkhet',
    module: './routes'
  },
  menus: [
    {
      text: 'Synchronizovat Erkhet',
      to: '/saashq-plugin-sync-erkhet/settings/general',
      image: '/images/icons/saashq-04.svg',
      location: "settings",
      scope: "syncerkhet",
      action: 'syncErkhetConfig',
      permission: "syncErkhetConfig",
    },
    {
      text: 'Synchronizovat Erkhet',
      url: '/sync-erkhet-history',
      icon: 'icon-file-check-alt',
      location: "mainNavigation",
      scope: 'syncerkhet',
      permission: 'syncErkhetConfig',
    },
  ]
};
