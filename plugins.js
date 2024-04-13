window.plugins = [
  {
    name: 'contacts',
    scope: 'contacts',
    exposes: {
      './routes': './src/routes.tsx',
      './activityLog': './src/activityLogs/activityLog.tsx',
      './automation': './src/automations/automation.tsx',
      './contactDetailHeader': './src/customers/containers/LeadState'
    },
    routes: {
      url:
        'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-contacts-ui/remoteEntry.js',
      scope: 'contacts',
      module: './routes'
    },
    activityLog: './activityLog',
    automation: './automation',
    contactDetailHeader: './contactDetailHeader',
    menus: [
      {
        text: 'Kontakty',
        url: '/contacts/customer',
        icon: 'icon-users',
        location: 'mainNavigation',
        permission: 'showCustomers'
      }
    ],
    url:
      'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-contacts-ui/remoteEntry.js'
  },
  {
    name: 'inbox',
    scope: 'inbox',
    exposes: {
      './routes': './src/routes.tsx',
      './activityLog': './src/activityLogs/activityLog.tsx',
      './automation': './src/automations/automation.tsx',
      './unreadCount': './src/inbox/containers/UnreadCount.tsx',
      './actionForms': './src/settings/integrations/containers/ActionForms'
    },
    routes: {
      url:
        'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-inbox-ui/remoteEntry.js',
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
        text: 'formuláře',
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
      }
    ],
    customNavigationLabel: [
      { text: 'počet nepřečtených', component: './unreadCount', scope: 'inbox' }
    ],
    url: 'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-inbox-ui/remoteEntry.js'
  },
  {
    name: 'facebook',
    scope: 'facebook',
    exposes: {
      './routes': './src/routes.tsx',
      './inboxIntegrationSettings':
        './src/containers/UpdateConfigsContainer.tsx',
      './activityLog': './src/containers/ActivityLogsContainer.tsx',
      './inboxConversationDetailRespondBoxMask':
        './src/containers/TagMessageContainer.tsx',
      './inboxConversationDetail':
        './src/containers/post/FbCommentsContainer.tsx'
    },
    routes: {
      url:
        'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-facebook-ui/remoteEntry.js',
      scope: 'facebook',
      module: './routes'
    },
    inboxIntegrationSettings: './inboxIntegrationSettings',
    inboxDirectMessage: {
      messagesQuery: {
        query:
          '\n          query facebookConversationMessages(\n            $conversationId: String!\n            $skip: Int\n            $limit: Int\n            $getFirst: Boolean\n          ) {\n            facebookConversationMessages(\n              conversationId: $conversationId,\n              skip: $skip,\n              limit: $limit,\n              getFirst: $getFirst\n            ) {\n              _id\n              content\n              conversationId\n              customerId\n              userId\n              createdAt\n              isCustomerRead\n              internal\n\n              attachments {\n                url\n                name\n                type\n                size\n              }\n\n              user {\n                _id\n                username\n                details {\n                  avatar\n                  fullName\n                  position\n                }\n              }\n\n              customer {\n                _id\n                avatar\n                firstName\n                middleName\n                lastName\n                primaryEmail\n                primaryPhone\n                state\n\n                companies {\n                  _id\n                  primaryName\n                  website\n                }\n\n                customFieldsData\n                tagIds\n              }\n            }\n          }\n        ',
        name: 'facebookConversationMessages',
        integrationKind: 'facebook-messenger'
      },
      countQuery: {
        query:
          '\n          query facebookConversationMessagesCount($conversationId: String!) {\n            facebookConversationMessagesCount(conversationId: $conversationId)\n          }\n        ',
        name: 'facebookConversationMessagesCount',
        integrationKind: 'facebook-messenger'
      }
    },
    inboxIntegrations: [
      {
        name: 'Facebook Post',
        description: 'Connect to Facebook posts right from your Týmová Schránka',
        inMessenger: false,
        isAvailable: true,
        kind: 'facebook-post',
        logo: '/images/integrations/facebook.png',
        createModal: 'facebook-post',
        createUrl: '/settings/integrations/createFacebook',
        category:
          'All integrations, For support teams, Marketing automation, Social media',
        components: ['inboxConversationDetail']
      },
      {
        name: 'Facebook Messenger',
        description:
          'Connect and manage Facebook Messages right from your Týmová Schránka',
        inMessenger: false,
        isAvailable: true,
        kind: 'facebook-messenger',
        logo: '/images/integrations/fb-messenger.png',
        createModal: 'facebook-messenger',
        createUrl: '/settings/integrations/createFacebook',
        category:
          'All integrations, For support teams, Messaging, Social media, Conversation',
        components: ['inboxConversationDetailRespondBoxMask']
      }
    ],
    activityLog: './activityLog',
    inboxConversationDetailRespondBoxMask:
      './inboxConversationDetailRespondBoxMask',
    inboxConversationDetail: './inboxConversationDetail',
    url:
      'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-facebook-ui/remoteEntry.js'
  },
  {
    name: 'tags',
    scope: 'tags',
    exposes: {
      './routes': './src/routes.tsx',
      './activityLog': './src/activityLogs/activityLog.tsx'
    },
    routes: {
      url:
        'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-tags-ui/remoteEntry.js',
      scope: 'tags',
      module: './routes'
    },
    activityLog: './activityLog',
    menus: [
      {
        text: 'Tagy',
        to: '/tags',
        image: '/images/icons/saashq-18.svg',
        location: 'settings',
        scope: 'tags',
        action: 'tagsAll',
        permissions: ['showTags', 'manageTags']
      }
    ],
    url: 'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-tags-ui/remoteEntry.js'
  },
  {
    name: 'cards',
    scope: 'cards',
    url: 'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-cards-ui/remoteEntry.js',
    exposes: {
      './routes': './src/routes.tsx',
      './settings': './src/Settings.tsx',
      './propertyGroupForm': './src/propertyGroupForm.tsx',
      './segmentForm': './src/segmentForm.tsx',
      './activityLog': './src/activityLogs/activityLog.tsx',
      './automation': './src/automations/automation.tsx',
      './contactDetailRightSidebar': './src/RightSidebar.tsx'
    },
    routes: {
      url:
        'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-cards-ui/remoteEntry.js',
      scope: 'cards',
      module: './routes'
    },
    propertyGroupForm: './propertyGroupForm',
    segmentForm: './segmentForm',
    activityLog: './activityLog',
    automation: './automation',
    contactDetailRightSidebar: './contactDetailRightSidebar',
    menus: [
      {
        text: 'Sales Pipeline',
        url: '/deal',
        icon: 'icon-piggy-bank',
        location: 'mainNavigation',
        permission: 'showDeals'
      },
      {
        text: 'Prodejní potrubí',
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
  },
  {
    name: 'automations',
    exposes: { './routes': './src/routes.tsx' },
    routes: {
      url:
        'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-automations-ui/remoteEntry.js',
      scope: 'automations',
      module: './routes'
    },
    menus: [
      {
        text: 'Automatizace',
        url: '/automations',
        location: 'mainNavigation',
        icon: 'icon-circular',
        permission: 'showAutomations'
      }
    ],
    url:
      'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-automations-ui/remoteEntry.js'
  },
  {
    name: 'segments',
    scope: 'segments',
    exposes: {
      './routes': './src/routes.tsx',
      './importExportFilterForm': './src/containers/SegmentsForm.tsx',
      './teamMemberSidebarComp': './src/containers/SegmentFilter.tsx'
    },
    routes: {
      url:
        'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-segments-ui/remoteEntry.js',
      scope: 'segments',
      module: './routes'
    },
    importExportFilterForm: './importExportFilterForm',
    teamMemberSidebarComp: './teamMemberSidebarComp',
    menus: [
      {
        text: 'Segmenty',
        url: '/segments',
        icon: 'icon-chart-pie-alt',
        location: 'mainNavigation',
        permission: 'showSegments'
      }
    ],
    url:
      'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-segments-ui/remoteEntry.js'
  },
  {
    name: 'forms',
    scope: 'forms',
    exposes: {
      './routes': './src/routes.tsx',
      './segmentForm': './src/segmentForm.tsx',
      './importExportUploadForm': './src/components/ColumnChooser',
      './fieldPreview': './src/components/FieldsPreview',
      './formPreview': './src/containers/FieldForm',
      './contactDetailLeftSidebar': './src/containers/CustomFieldsSection'
    },
    routes: {
      url:
        'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-forms-ui/remoteEntry.js',
      scope: 'forms',
      module: './routes'
    },
    segmentForm: './segmentForm',
    formPreview: './formPreview',
    fieldPreview: './fieldPreview',
    importExportUploadForm: './importExportUploadForm',
    contactDetailLeftSidebar: './contactDetailLeftSidebar',
    menus: [
      {
        text: 'Vlastnosti',
        to: '/settings/properties',
        image: '/images/icons/saashq-01.svg',
        location: 'settings',
        scope: 'forms',
        action: 'formsAll',
        permissions: ['showForms', 'manageForms']
      }
    ],
    url: 'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-forms-ui/remoteEntry.js'
  },
  {
    name: 'engages',
    exposes: { './routes': './src/routes.tsx' },
    routes: {
      url:
        'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-engages-ui/remoteEntry.js',
      scope: 'engages',
      module: './routes'
    },
    menus: [
      {
        text: 'Kampaně',
        url: '/campaigns',
        icon: 'icon-megaphone',
        location: 'mainNavigation',
        permission: 'showEngagesMessages'
      },
      {
        text: 'Nastavení kampaně',
        to: '/settings/campaign-configs',
        image: '/images/icons/saashq-08.svg',
        location: 'settings',
        scope: 'engages',
        action: 'engagesAll',
        permissions: ['showEngagesMessages']
      }
    ],
    url:
      'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-engages-ui/remoteEntry.js'
  },
  {
    name: 'logs',
    scope: 'logs',
    exposes: {
      './routes': './src/routes.tsx',
      './contactDetailContent': './src/logs/Activities.tsx'
    },
    routes: {
      url:
        'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-logs-ui/remoteEntry.js',
      scope: 'logs',
      module: './routes'
    },
    contactDetailContent: './contactDetailContent',
    menus: [
      {
        text: 'protokoly',
        to: '/settings/logs',
        image: '/images/icons/saashq-33.png',
        location: 'settings',
        scope: 'logs',
        component: './settings',
        action: '',
        permissions: []
      },
      {
        text: 'Doručování e-mailem',
        to: '/settings/emailDelivery',
        image: '/images/icons/saashq-27.png',
        location: 'settings',
        scope: 'logs',
        component: './settings',
        action: '',
        permissions: []
      }
    ],
    url: 'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-logs-ui/remoteEntry.js'
  },
  {
    name: 'knowledgebase',
    exposes: { './routes': './src/routes.tsx' },
    routes: {
      url:
        'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-knowledgebase-ui/remoteEntry.js',
      scope: 'knowledgebase',
      module: './routes'
    },
    menus: [
      {
        text: 'Znalostní báze',
        url: '/knowledgeBase',
        icon: 'icon-book-open',
        location: 'mainNavigation',
        permission: 'showKnowledgeBase'
      }
    ],
    url:
      'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-knowledgebase-ui/remoteEntry.js'
  },
  {
    name: 'notifications',
    exposes: {
      './routes': './src/routes.tsx',
      './settings': './src/containers/Widget.tsx'
    },
    routes: {
      url:
        'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-notifications-ui/remoteEntry.js',
      scope: 'notifications',
      module: './routes'
    },
    menus: [
      {
        text: 'oznámení',
        url: '/notifications',
        icon: 'icon-book-open',
        location: 'topNavigation',
        scope: 'notifications',
        component: './settings'
      },
      {
        text: 'Nastavení upozornění',
        to: '/settings/notifications',
        image: '/images/icons/saashq-11.svg',
        location: 'settings',
        scope: 'notifications'
      }
    ],
    url:
      'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-notifications-ui/remoteEntry.js'
  },
  {
    name: 'chats',
    exposes: {
      './routes': './src/routes.tsx',
      './widget': './src/components/Widget.tsx'
    },
    widget: './widget',
    routes: {
      url:
        'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-chats-ui/remoteEntry.js',
      scope: 'chats',
      module: './routes'
    },
    menus: [
      {
        text: 'Widget chatu',
        url: '/saashq-plugin-chat/widget',
        icon: 'icon-chat-1',
        location: 'topNavigation',
        scope: 'chats',
        component: './widget'
      },
      {
        text: 'Povídat si',
        url: '/saashq-plugin-chat',
        icon: 'icon-chat-1',
        location: 'mainNavigation',
        permission: 'showChats'
      }
    ],
    url: 'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-chats-ui/remoteEntry.js'
  },
  {
    name: 'clientportal',
    scope: 'clientportal',
    exposes: {
      './routes': './src/routes.tsx',
      './cardDetailAction': './src/containers/comments/CardDetailAction.tsx'
    },
    cardDetailAction: './cardDetailAction',
    routes: {
      url:
        'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-clientportal-ui/remoteEntry.js',
      scope: 'clientportal',
      module: './routes'
    },
    menus: [
      {
        text: 'Klientský portál',
        to: '/settings/client-portal',
        image: '/images/icons/saashq-32.png',
        location: 'settings',
        scope: 'clientportal',
        action: '',
        permissions: []
      }
    ],
    url:
      'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-clientportal-ui/remoteEntry.js'
  },
  {
    name: 'products',
    scope: 'products',
    exposes: {
      './routes': './src/routes.tsx',
      './extendFormField':
        './src/containers/productCategory/SelectProductCategory.tsx',
      './extendFormFieldChoice': './src/components/product/FormFieldChoice.tsx'
    },
    routes: {
      url:
        'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-products-ui/remoteEntry.js',
      scope: 'products',
      module: './routes'
    },
    extendFormField: './extendFormField',
    extendFormFieldChoice: './extendFormFieldChoice',
    menus: [
      {
        text: 'Produkt a služby',
        to: '/settings/product-service/',
        image: '/images/icons/saashq-31.png',
        location: 'settings',
        scope: 'products',
        action: 'productsAll',
        permissions: ['showProducts', 'manageProducts']
      },
      {
        text: 'Konfigurace produktů',
        to: '/settings/products-config/',
        image: '/images/icons/saashq-07.svg',
        location: 'settings',
        scope: 'products',
        action: 'productsAll',
        permissions: ['showProducts', 'manageProducts']
      }
    ],
    url:
      'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-products-ui/remoteEntry.js'
  },
  {
    name: 'dashboard',
    exposes: { './routes': './src/routes.tsx' },
    routes: {
      url:
        'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-dashboard-ui/remoteEntry.js',
      scope: 'dashboard',
      module: './routes'
    },
    menus: [
      {
        text: 'Zprávy',
        url: '/dashboard',
        icon: 'icon-dashboard',
        location: 'mainNavigation',
        permission: 'showDashboards'
      }
    ],
    url:
      'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-dashboard-ui/remoteEntry.js'
  },
  {
    name: 'emailtemplates',
    exposes: { './routes': './src/routes.tsx' },
    routes: {
      url:
        'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-emailtemplates-ui/remoteEntry.js',
      scope: 'emailtemplates',
      module: './routes'
    },
    menus: [
      {
        text: 'Šablony e-mailů',
        to: '/settings/email-templates',
        image: '/images/icons/saashq-09.svg',
        location: 'settings',
        scope: 'emailtemplates',
        action: 'emailTemplateAll',
        permissions: ['showEmailTemplates']
      }
    ],
    url:
      'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-emailtemplates-ui/remoteEntry.js'
  },
  {
    name: 'shq',
    exposes: { './routes': './src/routes.tsx' },
    routes: {
      url: 'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-shq-ui/remoteEntry.js',
      scope: 'shq',
      module: './routes'
    },
    menus: [
      {
        text: 'Shq jádro',
        to: '/saashq-plugin-shq/home',
        image: '/images/icons/saashq-30.png',
        location: 'settings',
        action: '',
        permissions: ['showShqs']
      }
    ],
    url: 'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-shq-ui/remoteEntry.js'
  },
  {
    name: 'shqfeed',
    exposes: { './routes': './src/routes.tsx' },
    routes: {
      url:
        'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-shqfeed-ui/remoteEntry.js',
      scope: 'shqfeed',
      module: './routes'
    },
    menus: [
      {
        text: 'Shq krmivo',
        url: '/saashq-plugin-shq-feed/home',
        icon: 'icon-list-2',
        location: 'mainNavigation',
        permission: 'showShqActivityFeed'
      }
    ],
    url:
      'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-shqfeed-ui/remoteEntry.js'
  },
  {
    name: 'timeclock',
    scope: 'timeclock',
    exposes: { './routes': './src/routes.tsx' },
    routes: {
      url:
        'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-timeclock-ui/remoteEntry.js',
      scope: 'timeclock',
      module: './routes'
    },
    menus: [
      {
        text: 'Hodiny',
        url: '/timeclocks',
        icon: 'icon-star',
        location: 'mainNavigation'
      }
    ],
    url:
      'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-timeclock-ui/remoteEntry.js'
  },
  {
    name: 'documents',
    scope: 'documents',
    exposes: {
      './routes': './src/routes.tsx',
      './cardDetailAction': './src/containers/CardDetailAction.tsx',
      './productListAction': './src/containers/ProductListAction.tsx'
    },
    cardDetailAction: './cardDetailAction',
    productListAction: './productListAction',
    routes: {
      url:
        'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-documents-ui/remoteEntry.js',
      scope: 'documents',
      module: './routes'
    },
    menus: [
      {
        text: 'Dokumenty',
        to: '/settings/documents',
        image: '/images/icons/saashq-09.svg',
        location: 'settings',
        scope: 'documents',
        action: 'documentsAll',
        permissions: ['manageDocuments']
      }
    ],
    url:
      'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-documents-ui/remoteEntry.js'
  },
  {
    name: 'filemanager',
    scope: 'filemanager',
    exposes: { './routes': './src/routes.tsx' },
    routes: {
      url:
        'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-filemanager-ui/remoteEntry.js',
      scope: 'filemanager',
      module: './routes'
    },
    menus: [
      {
        text: 'Správce souborů',
        url: '/filemanager',
        icon: 'icon-folder-1',
        location: 'mainNavigation',
        permissions: ['showFileManager']
      }
    ],
    url:
      'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-filemanager-ui/remoteEntry.js'
  },
  {
    name: 'bichil',
    scope: 'bichil',
    exposes: {
      './routes': './src/routes.tsx',
      './bichilReportTable': './src/containers/report/ReportList.tsx',
      './bichilExportReportBtn': './src/components/report/ExportBtn.tsx'
    },
    routes: {
      url:
        'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-bichil-ui/remoteEntry.js',
      scope: 'bichil',
      module: './routes'
    },
    bichilReportTable: './bichilReportTable',
    bichilExportReportBtn: './bichilExportReportBtn',
    menus: [
      {
        text: 'Bichils',
        to: '/bichils',
        image: '/images/icons/saashq-18.svg',
        location: 'settings',
        scope: 'bichil'
      }
    ],
    url: 'https://saashq-main-plugins.s3.us-east-1.amazonaws.com/uis/plugin-bichil-ui/remoteEntry.js'
  }
];
