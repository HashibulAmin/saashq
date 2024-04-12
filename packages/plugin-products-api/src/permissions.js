module.exports = {
  products: {
    name: 'products',
    description: 'Products',
    actions: [
      {
        name: 'productsAll',
        description: 'Všechno',
        use: ['showProducts', 'manageProducts', 'productsMerge', 'removeProducts']
      },
      {
        name: 'manageProducts',
        description: 'Manage products'
      },
      {
        name: 'removeProducts',
        description: 'Remove products'
      },
      {
        name: 'showProducts',
        description: 'Show products'
      },
      {
        name: 'productsMerge',
        description: 'Merge products'
      }
    ]
  }
};
