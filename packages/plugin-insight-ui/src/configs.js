module.exports = {
  srcDir: __dirname,
  name: 'insight',
  port: 3055,
  scope: 'insight',
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3055/remoteEntry.js',
    scope: 'insight',
    module: './routes'
  },
  menus: [
    {
      text: 'Porozumění',
      url: '/insight',
      icon: 'icon-reload',
      location: 'mainNavigation'
    }
  ]
};
