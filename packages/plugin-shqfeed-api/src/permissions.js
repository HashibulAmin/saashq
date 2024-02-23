module.exports = {
  engages: {
    name: "shqfeed",
    description: "Shq feed",
    actions: [
      { name: "showShqActivityFeed", description: "Show shq activity feed" },
      {
        name: "manageShqActivityFeed",
        description: "Manage shq activity feed",
      },
      {
        name: "shqActivityFeedAll",
        description: "All",
        use: ["showShqActivityFeed", "manageShqActivityFeed"],
      },
    ],
  },
};
