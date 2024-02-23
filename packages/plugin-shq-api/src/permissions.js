module.exports = {
  shq: {
    name: "shq",
    description: "Shq core",
    actions: [
      { name: "showShqs", description: "Show shq" },
      { name: "manageShqs", description: "Manage shq" },
      {
        name: "shqsAll",
        description: "All",
        use: ["showShqs", "manageShqs"],
      },
    ],
  },
};
