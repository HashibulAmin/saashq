module.exports = {
  srcDir: __dirname,
  name: 'zms',
  port: 3017,
  scope: 'zms',
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3017/remoteEntry.js',
    scope: 'zms',
    module: './routes'
  },
  menus:[
    {
      "text":"Zms",
      "url":"/plugin-zms/zms",
      "icon":"icon-star",
      "location":"mainNavigation"
    },
    {
      text: 'Hlavní konfigurace',
      image: '/images/icons/saashq-16.svg',
      to: '/plugin-zms/settings',
      action: 'mainConfig',
      scope: 'zms',
      location: 'settings',
  },]
};
