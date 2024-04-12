module.exports = {
  documents: {
    name: 'documents',
    description: 'Documents',
    actions: [
      {
        name: 'documentsAll',
        description: 'Všechno',
        use: ['manageDocuments', 'removeDocuments', 'showDocuments']
      },
      {
        name: 'manageDocuments',
        description: 'Manage documents'
      },
      {
        name: 'removeDocuments',
        description: 'Remove documents'
      },
      {
        name: 'showDocuments',
        description: 'Show documents'
      }

    ]
  },
}