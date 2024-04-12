module.exports = {
  emailTemplates: {
    name: 'emailTemplates',
    description: 'Email template',
    actions: [
      {
        name: 'emailTemplateAll',
        description: 'Všechno',
        use: ['showEmailTemplates', 'manageEmailTemplate', 'removeEmailTemplate']
      },
      {
        name: 'manageEmailTemplate',
        description: 'Manage email template'
      },
      {
        name: 'removeEmailTemplate',
        description: 'Remove email template'
      },
      {
        name: 'showEmailTemplates',
        description: 'Show email templates'
      }
    ]
  },
}