module.exports = {
  chats: {
    name: 'chats',
    description: 'Chats',
    actions: [
      {
        name: 'chatsAll',
        description: 'Všechno',
        use: ['showChats', 'manageChats'],
      },
      {
        name: 'showChats',
        description: 'Show chats',
      },
      {
        name: 'manageChats',
        description: 'Manage Chats',
      },
    ],
  },
};
