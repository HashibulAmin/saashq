module.exports = {
  deals: {
    name: 'deals',
    description: 'Deals',
    actions: [
      {
        name: 'dealsAll',
        description: 'Všechno',
        use: [
          'showDeals',
          'dealBoardsAdd',
          'dealBoardsEdit',
          'dealBoardsRemove',
          'dealPipelinesAdd',
          'dealPipelinesEdit',
          'dealPipelinesUpdateOrder',
          'dealPipelinesWatch',
          'dealPipelinesRemove',
          'dealPipelinesArchive',
          'dealPipelinesCopied',
          'dealStagesAdd',
          'dealStagesEdit',
          'dealStagesUpdateOrder',
          'dealStagesRemove',
          'dealsAdd',
          'dealsEdit',
          'dealsRemove',
          'dealsWatch',
          'dealsArchive',
          'dealsSort',
          'exportDeals',
          'dealUpdateTimeTracking'
        ]
      },
      {
        name: 'showDeals',
        description: 'Ukázat nabídky'
      },
      {
        name: 'dealBoardsAdd',
        description: 'Přidat panel nabídek'
      },
      {
        name: 'dealBoardsRemove',
        description: 'Odstraňte panel nabídek'
      },
      {
        name: 'dealPipelinesAdd',
        description: 'Přidat kanál nabídek'
      },
      {
        name: 'dealPipelinesEdit',
        description: 'Upravit kanál dohod'
      },
      {
        name: 'dealPipelinesRemove',
        description: 'Odstraňte kanál nabídek'
      },
      {
        name: 'dealPipelinesArchive',
        description: 'Archivační kanál dohod'
      },
      {
        name: 'dealPipelinesCopied',
        description: 'Duplicitní kanál dohod'
      },
      {
        name: 'dealPipelinesUpdateOrder',
        description: 'Aktualizujte pořadí potrubí'
      },
      {
        name: 'dealPipelinesWatch',
        description: 'Deal potrubí hodinky'
      },
      {
        name: 'dealStagesAdd',
        description: 'Přidat fázi dohody'
      },
      {
        name: 'dealStagesEdit',
        description: 'Upravit fázi dohody'
      },
      {
        name: 'dealStagesUpdateOrder',
        description: 'Aktualizujte pořadí etap'
      },
      {
        name: 'dealStagesRemove',
        description: 'Odebrat fázi dohody'
      },
      {
        name: 'dealsAdd',
        description: 'Add deal'
      },
      {
        name: 'dealsEdit',
        description: 'Upravit dohodu'
      },
      {
        name: 'dealsRemove',
        description: 'Odebrat dohodu'
      },
      {
        name: 'dealsWatch',
        description: 'Sledujte nabídku'
      },
      {
        name: 'dealsArchive',
        description: 'Archivujte všechny nabídky v určité fázi'
      },
      {
        name: 'dealsSort',
        description: 'Seřaďte všechny nabídky v konkrétní fázi'
      },
      {
        name: 'exportDeals',
        description: 'Exportní nabídky'
      },
      {
        name: 'dealUpdateTimeTracking',
        description: 'Aktualizujte sledování času'
      }
    ]
  },
  purchases: {
    name: 'purchases',
    description: 'Nákupy',
    actions: [
      {
        name: 'purchasesAll',
        description: 'Všechno',
        use: [
          'showPurchases',
          'purchaseBoardsAdd',
          'purchaseBoardsEdit',
          'purchaseBoardsRemove',
          'purchasePipelinesAdd',
          'purchasePipelinesEdit',
          'purchasePipelinesUpdateOrder',
          'purchasePipelinesWatch',
          'purchasePipelinesRemove',
          'purchasePipelinesArchive',
          'purchasePipelinesCopied',
          'purchaseStagesAdd',
          'purchaseStagesEdit',
          'purchaseStagesUpdateOrder',
          'purchaseStagesRemove',
          'purchasesAdd',
          'purchasesEdit',
          'purchasesRemove',
          'purchasesWatch',
          'purchasesArchive',
          'purchasesSort',
          'exportPurchases',
          'purchaseUpdateTimeTracking'
        ]
      },
      {
        name: 'showPurchases',
        description: 'Zobrazit nákupy'
      },
      {
        name: 'purchaseBoardsAdd',
        description: 'Přidejte nákupní desku'
      },
      {
        name: 'purchaseBoardsRemove',
        description: 'Odstraňte nákupní desku'
      },
      {
        name: 'purchasePipelinesAdd',
        description: 'Přidat nákupní kanál'
      },
      {
        name: 'purchasePipelinesEdit',
        description: 'Upravit nákupní kanál'
      },
      {
        name: 'purchasePipelinesRemove',
        description: 'Odstraňte nákupní potrubí'
      },
      {
        name: 'purchasePipelinesArchive',
        description: 'Archivovaný nákupní kanál'
      },
      {
        name: 'purchasePipelinesCopied',
        description: 'Duplicitní nákupní kanál'
      },
      {
        name: 'purchasePipelinesUpdateOrder',
        description: 'Aktualizujte pořadí potrubí'
      },
      {
        name: 'purchasePipelinesWatch',
        description: 'Nákup potrubí hodinky'
      },
      {
        name: 'purchaseStagesAdd',
        description: 'Přidat fázi nákupu'
      },
      {
        name: 'purchaseStagesEdit',
        description: 'Upravit fázi nákupu'
      },
      {
        name: 'purchaseStagesUpdateOrder',
        description: 'Aktualizujte pořadí etap'
      },
      {
        name: 'purchaseStagesRemove',
        description: 'Odebrat fázi nákupu'
      },
      {
        name: 'purchasesAdd',
        description: 'Přidat nákup'
      },
      {
        name: 'purchasesEdit',
        description: 'Upravit nákup'
      },
      {
        name: 'purchasesRemove',
        description: 'Odebrat nákup'
      },
      {
        name: 'purchasesWatch',
        description: 'Nákup hodinek'
      },
      {
        name: 'purchasesArchive',
        description: 'Archivujte všechny nákupy v konkrétní fázi'
      },
      {
        name: 'purchasesSort',
        description: 'Seřaďte všechny nákupy v konkrétní fázi'
      },
      {
        name: 'exportpurchases',
        description: 'Exportní nákupy'
      },
      {
        name: 'purchaseUpdateTimeTracking',
        description: 'Aktualizujte sledování času'
      }
    ]
  },
  tickets: {
    name: 'tickets',
    description: 'Vstupenky',
    actions: [
      {
        name: 'ticketsAll',
        description: 'Všechno',
        use: [
          'showTickets',
          'ticketBoardsAdd',
          'ticketBoardsEdit',
          'ticketBoardsRemove',
          'ticketPipelinesAdd',
          'ticketPipelinesEdit',
          'ticketPipelinesUpdateOrder',
          'ticketPipelinesWatch',
          'ticketPipelinesRemove',
          'ticketPipelinesArchive',
          'ticketPipelinesCopied',
          'ticketStagesAdd',
          'ticketStagesEdit',
          'ticketStagesUpdateOrder',
          'ticketStagesRemove',
          'ticketsAdd',
          'ticketsEdit',
          'ticketsRemove',
          'ticketsWatch',
          'ticketsArchive',
          'ticketsSort',
          'exportTickets',
          'ticketUpdateTimeTracking'
        ]
      },
      {
        name: 'showTickets',
        description: 'Ukaž lístky'
      },
      {
        name: 'ticketBoardsAdd',
        description: 'Přidejte desku lístků'
      },
      {
        name: 'ticketBoardsEdit',
        description: 'Upravit desku lístků'
      },
      {
        name: 'ticketBoardsRemove',
        description: 'Odstraňte desku lístků'
      },
      {
        name: 'ticketPipelinesAdd',
        description: 'Přidat kanál lístků'
      },
      {
        name: 'ticketPipelinesEdit',
        description: 'Upravit kanál lístků'
      },
      {
        name: 'ticketPipelinesRemove',
        description: 'Odstraňte potrubí lístků'
      },
      {
        name: 'ticketPipelinesArchive',
        description: 'Potrubí archivu lístků'
      },
      {
        name: 'ticketPipelinesCopied',
        description: 'Duplicitní kanál vstupenek'
      },
      {
        name: 'ticketPipelinesWatch',
        description: 'Hodinky na prodej vstupenek'
      },
      {
        name: 'ticketPipelinesUpdateOrder',
        description: 'Aktualizujte pořadí potrubí'
      },
      {
        name: 'ticketStagesAdd',
        description: 'Přidat fázi lístku'
      },
      {
        name: 'ticketStagesEdit',
        description: 'Upravit fázi lístku'
      },
      {
        name: 'ticketStagesUpdateOrder',
        description: 'Aktualizujte pořadí etap'
      },
      {
        name: 'ticketStagesRemove',
        description: 'Odebrat fázi lístku'
      },
      {
        name: 'ticketsAdd',
        description: 'Přidat lístek'
      },
      {
        name: 'ticketsEdit',
        description: 'Upravit lístek'
      },
      {
        name: 'ticketsRemove',
        description: 'Odebrat lístek'
      },
      {
        name: 'ticketsWatch',
        description: 'Sledujte lístek'
      },
      {
        name: 'ticketsArchive',
        description: 'Archivujte všechny vstupenky v určité fázi'
      },
      {
        name: 'ticketsSort',
        description: 'Seřaďte všechny vstupenky v určité fázi'
      },
      {
        name: 'exportTickets',
        description: 'Export lístků'
      },
      {
        name: 'ticketUpdateTimeTracking',
        description: 'Aktualizujte sledování času'
      }
    ]
  },
  growthHacks: {
    name: 'growthHacks',
    description: 'Hacking růstu',
    actions: [
      {
        name: 'growthHacksAll',
        description: 'Všechno',
        use: [
          'showGrowthHacks',
          'growthHackBoardsAdd',
          'growthHackBoardsEdit',
          'growthHackBoardsRemove',
          'growthHackPipelinesAdd',
          'growthHackPipelinesEdit',
          'growthHackPipelinesUpdateOrder',
          'growthHackPipelinesWatch',
          'growthHackPipelinesRemove',
          'growthHackPipelinesArchive',
          'growthHackPipelinesCopied',
          'growthHackStagesAdd',
          'growthHackStagesEdit',
          'growthHackStagesUpdateOrder',
          'growthHackStagesRemove',
          'growthHacksAdd',
          'growthHacksEdit',
          'growthHacksRemove',
          'growthHacksWatch',
          'growthHacksArchive',
          'growthHacksSort',
          'growthHackTemplatesAdd',
          'growthHackTemplatesEdit',
          'growthHackTemplatesRemove',
          'growthHackTemplatesDuplicate',
          'showGrowthHackTemplates'
        ]
      },
      {
        name: 'showGrowthHacks',
        description: 'Ukažte růstové hacky'
      },
      {
        name: 'growthHackBoardsAdd',
        description: 'Přidejte desku pro hackování růstu'
      },
      {
        name: 'growthHackBoardsRemove',
        description: 'Remove growth hacking board'
      },
      {
        name: 'growthHackPipelinesAdd',
        description: 'Add growth hacking pipeline'
      },
      {
        name: 'growthHackPipelinesEdit',
        description: 'Edit growth hacking pipeline'
      },
      {
        name: 'growthHackPipelinesRemove',
        description: 'Remove growth hacking pipeline'
      },
      {
        name: 'growthHackPipelinesArchive',
        description: 'Archive growth hacking pipeline'
      },
      {
        name: 'growthHackPipelinesCopied',
        description: 'Copied growth hacking pipeline'
      },
      {
        name: 'growthHackPipelinesWatch',
        description: 'Growth hacking pipeline watch'
      },
      {
        name: 'growthHackPipelinesUpdateOrder',
        description: 'Update pipeline order'
      },
      {
        name: 'growthHackStagesAdd',
        description: 'Add growth hacking stage'
      },
      {
        name: 'growthHackStagesEdit',
        description: 'Edit growth hacking stage'
      },
      {
        name: 'growthHackStagesUpdateOrder',
        description: 'Update stage order'
      },
      {
        name: 'growthHackStagesRemove',
        description: 'Remove growth hacking stage'
      },
      {
        name: 'growthHacksAdd',
        description: 'Add growth hacking'
      },
      {
        name: 'growthHacksEdit',
        description: 'Edit growth hacking'
      },
      {
        name: 'growthHacksRemove',
        description: 'Remove growth hacking'
      },
      {
        name: 'growthHacksWatch',
        description: 'Watch growth hacking'
      },
      {
        name: 'growthHacksArchive',
        description: 'Archive all growth hacks in a specific stage'
      },
      {
        name: 'growthHacksSort',
        description: 'Sort all growth hacks in a specific stage'
      },
      {
        name: 'growthHackTemplatesAdd',
        description: 'Add growth hacking template'
      },
      {
        name: 'growthHackTemplatesEdit',
        description: 'Edit growth hacking template'
      },
      {
        name: 'growthHackTemplatesRemove',
        description: 'Remove growth hacking template'
      },
      {
        name: 'growthHackTemplatesDuplicate',
        description: 'Duplicate growth hacking template'
      },
      {
        name: 'showGrowthHackTemplates',
        description: 'Show growth hacking template'
      }
    ]
  },
  tasks: {
    name: 'tasks',
    description: 'Tasks',
    actions: [
      {
        name: 'tasksAll',
        description: 'Všechno',
        use: [
          'showTasks',
          'taskBoardsAdd',
          'taskBoardsEdit',
          'taskBoardsRemove',
          'taskPipelinesAdd',
          'taskPipelinesEdit',
          'taskPipelinesUpdateOrder',
          'taskPipelinesWatch',
          'taskPipelinesRemove',
          'taskPipelinesArchive',
          'taskPipelinesCopied',
          'taskStagesAdd',
          'taskStagesEdit',
          'taskStagesUpdateOrder',
          'taskStagesRemove',
          'tasksAdd',
          'tasksEdit',
          'tasksRemove',
          'tasksWatch',
          'tasksArchive',
          'tasksSort',
          'taskUpdateTimeTracking',
          'exportTasks'
        ]
      },
      {
        name: 'showTasks',
        description: 'Show tasks'
      },
      {
        name: 'taskBoardsAdd',
        description: 'Add task board'
      },
      {
        name: 'taskBoardsRemove',
        description: 'Remove task board'
      },
      {
        name: 'taskPipelinesAdd',
        description: 'Add task pipeline'
      },
      {
        name: 'taskPipelinesEdit',
        description: 'Edit task pipeline'
      },
      {
        name: 'taskPipelinesRemove',
        description: 'Remove task pipeline'
      },
      {
        name: 'taskPipelinesArchive',
        description: 'Archive task pipeline'
      },
      {
        name: 'taskPipelinesCopied',
        description: 'Duplicate task pipeline'
      },
      {
        name: 'taskPipelinesWatch',
        description: 'Task pipeline watch'
      },
      {
        name: 'taskPipelinesUpdateOrder',
        description: 'Update pipeline order'
      },
      {
        name: 'taskStagesAdd',
        description: 'Add task stage'
      },
      {
        name: 'taskStagesEdit',
        description: 'Edit task stage'
      },
      {
        name: 'taskStagesUpdateOrder',
        description: 'Update stage order'
      },
      {
        name: 'taskStagesRemove',
        description: 'Remove task stage'
      },
      {
        name: 'tasksAdd',
        description: 'Add task'
      },
      {
        name: 'tasksEdit',
        description: 'Edit task'
      },
      {
        name: 'tasksRemove',
        description: 'Remove task'
      },
      {
        name: 'tasksWatch',
        description: 'Watch task'
      },
      {
        name: 'tasksArchive',
        description: 'Archive all tasks in a specific stage'
      },
      {
        name: 'tasksSort',
        description: 'Sort all tasks in a specific stage'
      },
      {
        name: 'taskUpdateTimeTracking',
        description: 'Update time tracking'
      },
      {
        name: 'exportTasks',
        description: 'Export tasks'
      }
    ]
  },
}