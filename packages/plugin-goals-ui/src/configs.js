module.exports = {
  srcDir: __dirname,
  name: 'goalType',
  port: 3017,
  scope: 'goalType',
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3017/remoteEntry.js',
    scope: 'goalType',
    module: './routes'
  },
  menus: [
    {
      text: 'Cíle',
      to: '/saashq-plugin-goalType/goalType',
      image: '/images/icons/saashq-18.svg',
      location: 'settings',
      scope: 'goalType'
    }
  ]
};
