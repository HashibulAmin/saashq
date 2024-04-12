module.exports = {
  shqfeed: {
    name: 'shqfeed',
    description: 'Shq feed',
    actions: [
      { name: 'showShqActivityFeed', description: 'Show shq activity feed' },
      {
        name: 'manageShqActivityFeed',
        description: 'Manage shq activity feed',
      },
      {
        name: 'shqActivityFeedAll',
        description: 'Všechno',
        use: ['showShqActivityFeed', 'manageShqActivityFeed'],
      },
    ],
  },
};
