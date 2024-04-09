module.exports = {
  srcDir: __dirname,
  name: 'reports',
  port: 3045,
  scope: 'reports',
  exposes: {
    './routes': './src/routes.tsx',
    './reportsCommonFormButton': './src/containers/common/CommonFormButton.tsx'
  },
  routes: {
    url: 'http://localhost:3045/remoteEntry.js',
    scope: 'reports',
    module: './routes'
  },
  reportsCommonFormButton: './reportsCommonFormButton',
  menus: [
    {
      text: 'Zprávy',
      to: '/reports',
      image: '/images/icons/saashq-18.svg',
      location: 'settings',
      scope: 'reports'
    }
  ]
};
