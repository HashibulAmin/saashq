module.exports = {
  srcDir: __dirname,
  name: 'productplaces',
  port: 3029,
  exposes: {
    './routes': './src/routes.tsx',
    "./response": "./src/response.tsx"
  },
  routes: {
    url: 'http://localhost:3029/remoteEntry.js',
    scope: 'productplaces',
    module: './routes'
  },
  menus: [
    {
      text: 'Produktová místa',
      to: '/saashq-plugin-product-places/settings/stage',
      image: '/images/icons/saashq-04.svg',
      location: "settings",
      scope: "productplaces",
      action: 'productPlacesConfig',
      permission: "productPlacesConfig",
    },
  ],
  layout: {
    url: "http://localhost:3029/remoteEntry.js",
    scope: "productplaces",
    module: "./response"
  }
};
