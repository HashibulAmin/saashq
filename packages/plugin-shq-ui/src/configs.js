module.exports = {
  srcDir: __dirname,
  name: 'shq',
  port: 3105,
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3105/remoteEntry.js',
    scope: 'shq',
    module: './routes'
  },
  menus: [
    {
      text: 'Shq core',
      to: '/saashq-plugin-shq/home',
      image: '/images/icons/saashq-30.png',
      location: 'settings',
      action: '',
      permissions: ['showShqs']
    }
  ]
};
