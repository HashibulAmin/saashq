module.exports = {
  webbuilder: {
    name: 'webbuilder',
    description: 'Webbuilder',
    actions: [
      {
        name: 'webbuilderAll',
        description: 'Všechno',
        use: ['showWebbuilder', 'manageWebbuilder']
      },
      {
        name: 'showWebbuilder',
        description: 'Show webbuilder'
      },
      {
        name: 'manageWebbuilder',
        description: 'Manage webbuilder'
      }
    ]
  }
};
