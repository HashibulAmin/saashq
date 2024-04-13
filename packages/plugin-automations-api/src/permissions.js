module.exports = {
  automations: {
    name: 'automations',
    description: 'Automatizace',
    actions: [
      {
        name: 'automationAll',
        description: 'Všechno',
        use: [
          'showAutomations',
          'automationsAdd',
          'automationsEdit',
          'automationsRemove'
        ]
      },
      {
        name: 'showAutomations',
        description: 'Zobrazit automatizace'
      },
      {
        name: 'automationsAdd',
        description: 'Přidejte automatizace'
      },
      {
        name: 'automationsEdit',
        description: 'Upravit automatizaci'
      },
      {
        name: 'automationsRemove',
        description: 'Odstraňte automatizaci'
      }
    ]
  }
};
