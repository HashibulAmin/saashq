module.exports = {
  srcDir: __dirname,
  name: 'cards',
  port: 3003,
  scope: 'cards',
  url: 'http://localhost:3003/remoteEntry.js',
  exposes: {
    './routes': './src/routes.tsx',
    './settings': './src/Settings.tsx',
    './propertyGroupForm': './src/propertyGroupForm.tsx',
    './segmentForm': './src/segmentForm.tsx',
    './activityLog': './src/activityLogs/activityLog.tsx',
    './automation': './src/automations/automation.tsx',
    './contactDetailRightSidebar': './src/RightSidebar.tsx',
    './selectRelation': './src/common/SelectRelation.tsx',
    './invoiceDetailRightSection': './src/common/Item.tsx',
  },
  routes: {
    url: 'http://localhost:3003/remoteEntry.js',
    scope: 'cards',
    module: './routes'
  },
  propertyGroupForm: './propertyGroupForm',
  segmentForm: './segmentForm',
  activityLog: './activityLog',
  automation: './automation',
  contactDetailRightSidebar: './contactDetailRightSidebar',
  invoiceDetailRightSection: './invoiceDetailRightSection',
  selectRelation: './selectRelation',
  menus: [
    {
      text: 'Prodejní potrubí',
      url: '/deal',
      icon: 'icon-piggy-bank',
      location: 'mainNavigation',
      permission: 'showDeals'
    },
    {
      text: 'Nákupní potrubí',
      url: '/purchase',
      icon: 'icon-bag-alt',
      location: 'mainNavigation',
      permission: 'showPurchases'
    },
    {
      text: 'Úkol',
      url: '/task',
      icon: 'icon-file-check-alt',
      location: 'mainNavigation',
      permission: 'showTasks'
    },
    {
      text: 'Lístek',
      url: '/ticket',
      icon: 'icon-ticket',
      location: 'mainNavigation',
      permission: 'showTickets'
    },
    {
      text: 'hackování růstu',
      url: '/growthHack',
      icon: 'icon-idea',
      location: 'mainNavigation',
      permission: 'showGrowthHacks'
    },
    {
      text: 'Prodejní potrubí',
      to: '/settings/boards/deal',
      image: '/images/icons/saashq-25.png',
      location: 'settings',
      scope: 'cards',
      action: 'dealsAll',
      permissions: [
        'dealBoardsAdd',
        'dealBoardsEdit',
        'dealBoardsRemove',
        'dealPipelinesAdd',
        'dealPipelinesEdit',
        'dealPipelinesUpdateOrder',
        'dealPipelinesRemove',
        'dealPipelinesArchive',
        'dealPipelinesArchive',
        'dealStagesAdd',
        'dealStagesEdit',
        'dealStagesUpdateOrder',
        'dealStagesRemove'
      ]
    },
    {
      text: 'Nákupní potrubí',
      to: '/settings/boards/purchase',
      image: '/images/icons/saashq-25.png',
      location: 'settings',
      scope: 'cards',
      action: 'purchasesAll',
      permissions: [
        'purchaseBoardsAdd',
        'purchaseBoardsEdit',
        'purchaseBoardsRemove',
        'purchasePipelinesAdd',
        'purchasePipelinesEdit',
        'purchasePipelinesUpdateOrder',
        'purchasePipelinesRemove',
        'purchasePipelinesArchive',
        'purchasePipelinesArchive',
        'purchaseStagesAdd',
        'purchaseStagesEdit',
        'purchaseStagesUpdateOrder',
        'purchaseStagesRemove'
      ]
    },
    {
      text: 'Potrubí úloh',
      to: '/settings/boards/task',
      image: '/images/icons/saashq-13.svg',
      location: 'settings',
      scope: 'cards',
      action: 'tasksAll',
      permissions: [
        'taskBoardsAdd',
        'taskBoardsEdit',
        'taskBoardsRemove',
        'taskPipelinesAdd',
        'taskPipelinesEdit',
        'taskPipelinesUpdateOrder',
        'taskPipelinesRemove',
        'taskPipelinesArchive',
        'taskPipelinesCopied',
        'taskStagesAdd',
        'taskStagesEdit',
        'taskStagesUpdateOrder',
        'taskStagesRemove',
        'tasksAll'
      ]
    },
    {
      text: 'Vstupenky',
      to: '/settings/boards/ticket',
      image: '/images/icons/saashq-19.svg',
      location: 'settings',
      scope: 'cards',
      action: 'ticketsAll',
      permissions: [
        'ticketBoardsAdd',
        'ticketBoardsEdit',
        'ticketBoardsRemove',
        'ticketPipelinesAdd',
        'ticketPipelinesEdit',
        'ticketPipelinesUpdateOrder',
        'ticketPipelinesRemove',
        'ticketPipelinesArchive',
        'ticketPipelinesCopied',
        'ticketStagesAdd',
        'ticketStagesEdit',
        'ticketStagesUpdateOrder',
        'ticketStagesRemove'
      ]
    },
    {
      text: 'Šablony pro hackování růstu',
      to: '/settings/boards/growthHackTemplate',
      image: '/images/icons/saashq-12.svg',
      location: 'settings',
      scope: 'cards',
      action: 'growthHacksAll',
      permissions: [
        'growthHackTemplatesAdd',
        'growthHackTemplatesEdit',
        'growthHackTemplatesRemove',
        'growthHackTemplatesDuplicate',
        'showGrowthHackTemplates'
      ]
    }
  ]
};
