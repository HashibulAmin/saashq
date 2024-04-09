module.exports = {
  srcDir: __dirname,
  name: 'assets',
  port: 3012,
  scope: 'assets',
  exposes: {
    './routes': './src/routes.tsx',
    './selectWithAsset': './src/common/SelectWithAssets.tsx',
  },
  routes: {
    url: 'http://localhost:3012/remoteEntry.js',
    scope: 'assets',
    module: './routes'
  },
  formsExtraFields: [
    {
      scope: 'assets',
      component: './selectWithAsset',
      type: 'asset',
    },
  ],
  menus: [
    {
      text: 'Aktiva',
      to: '/settings/assets/',
      image: '/images/icons/saashq-18.svg',
      location: 'settings',
      scope: 'assets',
      action: 'assetsAll',
      permissions: ['showAssets', 'manageAssets']
    },
    {
      text: 'Aktiva a pohyby',
      url: '/asset-movements',
      icon: 'icon-piggybank',
      location: 'mainNavigation',
      action: 'assetsAll',
      permissions: ['showAssets', 'manageAssets']
    }
  ]
};
