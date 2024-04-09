module.exports = {
  srcDir: __dirname,
  name: 'inbox',
  port: 3009,
  scope: 'inbox',
  exposes: {
    './routes': './src/routes.tsx',
    './activityLog': './src/activityLogs/activityLog.tsx',
    './automation': './src/automations/automation.tsx',
    './unreadCount': './src/inbox/containers/UnreadCount.tsx',
    './actionForms': './src/settings/integrations/containers/ActionForms',
    './emailWidget': './src/inbox/containers/EmailWidget.tsx',
    './integrationDetailsForm': './src/forms/components/CallproEditForm.tsx',
  },
  routes: {
    url: 'http://localhost:3009/remoteEntry.js',
    scope: 'inbox',
    module: './routes'
  },
  activityLog: './activityLog',
  automation: './automation',
  actionForms: './actionForms',
  menus: [
    {
      text: 'Týmová schránka',
      url: '/inbox',
      icon: 'icon-chat',
      location: 'mainNavigation',
      permission: 'showConversations'
    },
    {
      text: 'Rezervace',
      url: '/bookings',
      icon: 'icon-paste',
      location: 'mainNavigation',
      permission: 'showIntegrations'
    },
    {
      text: 'Formuláře',
      url: '/forms',
      icon: 'icon-laptop',
      location: 'mainNavigation',
      permission: 'showForms'
    },
    {
      text: 'Dovednosti',
      to: '/settings/skills',
      image: '/images/icons/saashq-29.png',
      location: 'settings',
      scope: 'inbox',
      action: 'skillTypesAll',
      permissions: [
        'getSkillTypes',
        'getSkill',
        'getSkills',
        'manageSkills',
        'manageSkillTypes'
      ]
    },
    {
      text: 'Kanály',
      to: '/settings/channels',
      image: '/images/icons/saashq-05.svg',
      location: 'settings',
      scope: 'inbox',
      action: 'channelsAll',
      permissions: ['showChannels', 'manageChannels']
    },
    {
      text: 'Integrace',
      to: '/settings/integrations',
      image: '/images/icons/saashq-04.svg',
      location: 'settings',
      scope: 'inbox',
      action: 'integrationsAll',
      permissions: [
        'showIntegrations',
        'integrationsCreateMessengerIntegration',
        'integrationsEditMessengerIntegration',
        'integrationsSaveMessengerAppearanceData',
        'integrationsSaveMessengerConfigs',
        'integrationsCreateLeadIntegration',
        'integrationsEditLeadIntegration',
        'integrationsRemove',
        'integrationsArchive',
        'integrationsEdit'
      ]
    },
    {
      text: 'Konfigurace integrací',
      to: '/settings/integrations-config',
      image: '/images/icons/saashq-24.svg',
      location: 'settings',
      scope: 'inbox',
      action: 'generalSettingsAll',
      permissions: ['manageGeneralSettings', 'showGeneralSettings']
    },
    {
      text: 'Odezvy',
      to: '/settings/response-templates',
      image: '/images/icons/saashq-10.svg',
      location: 'settings',
      scope: 'inbox',
      action: 'responseTemplatesAll',
      permissions: ['manageResponseTemplate', 'showResponseTemplates']
    },
    {
      text: 'Správce skriptů widgetů',
      to: '/settings/scripts',
      image: '/images/icons/saashq-34.png',
      location: 'settings',
      scope: 'inbox',
      action: 'scriptsAll',
      permissions: ['manageScripts', 'showScripts']
    },
    {
      text: "Poslat email",
      url: "/emailWidget",
      icon: "icon-envelope",
      location: "topNavigation",
      scope: "inbox",
      component: "./emailWidget",
    }
  ],
  customNavigationLabel: [
    {
      text: "počet nepřečtených",
      component: "./unreadCount",
      scope: "inbox",
    }
  ],
  integrationDetailsForm: './integrationDetailsForm',
};
