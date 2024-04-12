module.exports = {
  clientPortal: {
    name: 'clientPortal',
    description: 'Business portal',
    actions: [
      {
        name: 'clientPortalAll',
        description: 'Všechno',
        use: ['manageClientPortal', 'removeClientPortal', 'updateUser']
      },
      {
        name: 'manageClientPortal',
        description: 'Manage client portal',
      },
      {
        name: 'removeClientPortal',
        description: 'Remove client portal',
      },
      {
        name: 'updateUser',
        description: 'Update user',
      },
    ],
  },
};