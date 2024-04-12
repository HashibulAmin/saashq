module.exports = {
  timeclock: {
    name: 'timeclock',
    description: 'Timeclock',
    actions: [
      {
        name: 'timeclocksAll',
        description: 'Všechno',
        use: ['showTimeclocks', 'manageTimeclocks']
      },
      {
        name: 'manageTimeclocks',
        description: 'Manage timeclocks'
      },
      {
        name: 'showTimeclocks',
        description: 'Show timeclocks'
      }
    ]
  }
};
