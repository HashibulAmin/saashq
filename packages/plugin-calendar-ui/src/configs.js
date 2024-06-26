module.exports = {
  srcDir: __dirname,
  name: "calendar",
  port: 3006,
  exposes: {
    "./routes": "./src/routes.tsx",
    "./settings": "./src/Settings.tsx",
  },
  routes: {
    url: "http://localhost:3006/remoteEntry.js",
    scope: "calendar",
    module: "./routes",
  },
  menus: [
    {
      text: "Kalendář",
      url: "/calendar",
      icon: "icon-calendar-alt",
      location: "mainNavigation",
      permission: "showCalendars",
    },
    {
      text: "Nastavení kalendáře",
      to: "/settings/calendars",
      image: "/images/icons/saashq-21.svg",
      location: "settings",
      scope: "calendar",
      action: "calendarsAll",
      permissions: [
        "calendarsAdd",
        "calendarsEdit",
        "calendarsRemove",
        "showCalendars",
        "showCalendarGroups",
        "calendarGroupsAdd",
        "calendarGroupsEdit",
        "calendarGroupsRemove",
      ],
    },
  ],
};
