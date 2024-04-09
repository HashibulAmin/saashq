module.exports = {
  srcDir: __dirname,
  name: 'riskassessment',
  port: 3012,
  scope: 'riskassessment',
  exposes: {
    './routes': './src/routes.tsx',
    './cardSideBarSection': './src/assessments/section/containers/Section.tsx',
    './selectVistors': './src/Visitors.tsx'
  },
  routes: {
    url: 'http://localhost:3012/remoteEntry.js',
    scope: 'riskassessment',
    module: './routes'
  },
  formsExtraFields: [
    {
      scope: 'riskassessment',
      component: './selectVistors',
      type: 'riskAssessmentVisitors'
    }
  ],
  menus: [
    {
      text: 'Hodnocení rizik',
      to: '/settings/risk-indicators',
      image: '/images/icons/saashq-18.svg',
      location: 'settings',
      scope: 'riskassessment',
      action: 'riskAssessmentAll',
      permissions: ['showRiskAssessment', 'manageRiskAssessment']
    },
    {
      text: 'Operace',
      to: '/settings/operations',
      image: '/images/icons/saashq-18.svg',
      location: 'settings',
      scope: 'riskassessment',
      action: 'riskAssessmentAll',
      permissions: ['showRiskAssessment', 'manageRiskAssessment']
    },
    {
      text: 'Hodnocení rizik',
      url: '/risk-assessments',
      icon: 'icon-followers',
      location: 'mainNavigation',
      action: 'riskAssessmentAll',
      permissions: ['showRiskAssessment', 'manageRiskAssessment']
    }
  ],
  dealRightSidebarSection: [
    {
      text: 'sekce hodnocení rizik',
      component: './cardSideBarSection',
      scope: 'riskassessment',
      action: 'riskAssessmentAll',
      permissions: ['showRiskAssessment', 'manageRiskAssessment']
    }
  ],
  ticketRightSidebarSection: [
    {
      text: 'sekce hodnocení rizik',
      component: './cardSideBarSection',
      scope: 'riskassessment',
      action: 'riskAssessmentAll',
      permissions: ['showRiskAssessment', 'manageRiskAssessment']
    }
  ],
  taskRightSidebarSection: [
    {
      text: 'sekce hodnocení rizik',
      component: './cardSideBarSection',
      scope: 'riskassessment',
      action: 'riskAssessmentAll',
      permissions: ['showRiskAssessment', 'manageRiskAssessment']
    }
  ]
};
