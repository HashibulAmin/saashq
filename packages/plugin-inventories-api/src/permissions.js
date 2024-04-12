module.exports = {
  inventories: {
    name: 'inventories',
    description: 'Inventories',
    actions: [
      {
        name: 'inventoriesAll',
        description: 'Všechno',
        use: ['manageRemainders']
      },
      {
        name: 'manageRemainder',
        description: 'Manage remainders'
      }
    ]
  }
};
