module.exports = {
  srcDir: __dirname,
  name: 'processes',
  port: 3025,
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3025/remoteEntry.js',
    scope: 'processes',
    module: './routes'
  },
  menus: [
    {
      text: 'Procesy',
      to: '/processes/jobs',
      image: '/images/icons/saashq-31.png',
      location: 'settings',
      scope: 'processes',
      action: '',
      permissions: ['showJobs', 'manageJobs']
    },
    {
      text: 'Procesy',
      url: '/processes/overallWorks',
      icon: 'icon-file-check-alt',
      location: 'mainNavigation'
      
      ,
      scope: 'processes',
      permission: 'showWorks'
    }
  ]
};
