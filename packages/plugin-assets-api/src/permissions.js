module.exports = {
  products: {
    name: 'assets',
    description: 'Aktiva',
    actions: [
      {
        name: 'assetsAll',
        description: 'Všechno',
        use: ['showAssets', 'manageAssets', 'assetsMerge']
      },
      {
        name: 'manageAssets',
        description: 'Spravovat majetek',
        use: ['showAssets']
      },
      {
        name: 'showAssets',
        description: 'Zobrazit aktiva'
      },
      {
        name: 'assetsMerge',
        description: 'Sloučit aktiva'
      },
      {
        name: 'assetsAssignKbArticles',
        description: 'Přiřaďte články znalostní báze'
      }
    ]
  }
};
