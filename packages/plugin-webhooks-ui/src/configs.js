module.exports = {
  srcDir: __dirname,
  name: 'webhooks',
  port: 3024,
  scope: 'webhooks',
  exposes: {
    './routes': './src/routes.tsx',
    './automation': './src/automations/automations.tsx'
  },
  routes: {
    url: 'http://localhost:3024/remoteEntry.js',
    scope: 'webhooks',
    module: './routes'
  },
  automation: './automation',
  menus: [
    {
      text: 'Odchozí webhooky',
      to: '/settings/webhooks',
      image: '/images/icons/saashq-11.svg',
      location: 'settings',
      scope: 'webhooks',
      action: 'webhooksAll',
      permissions: ['showWebhooks']
    }
  ]
};
