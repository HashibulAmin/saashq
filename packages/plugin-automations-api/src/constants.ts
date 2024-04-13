export const ACTIONS = {
  WAIT: 'delay',
  IF: 'if',
  SET_PROPERTY: 'setProperty',
  SEND_EMAIL: 'sendEmail',
};

export const EMAIL_RECIPIENTS_TYPES = [
  {
    type: 'customMail',
    name: 'customMails',
    label: 'Vlastní Maily',
  },
  {
    type: 'attributionMail',
    name: 'attributionMails',
    label: 'Atribuční Maily',
  },
  {
    type: 'segmentBased',
    name: 'segmentBased',
    label: 'Spustit E-maily Založené na Segmentech',
  },
  {
    type: 'teamMember',
    name: 'teamMemberIds',
    label: 'Členové Týmu',
  },
];

export const UI_ACTIONS = [
  {
    type: 'if',
    icon: 'sitemap-1',
    label: 'Větve',
    description: 'Vytvořte jednoduché větve nebo pokud/pak',
    isAvailable: true,
  },
  {
    type: 'setProperty',
    icon: 'flask',
    label: 'Správa vlastností',
    description:
      'Aktualizujte stávající výchozí nebo vlastní vlastnosti pro kontakty, společnosti, karty, konverzace',
    isAvailable: true,
  },
  {
    type: 'delay',
    icon: 'hourglass',
    label: 'Zpoždění',
    description:
      'Odložte další akci pomocí časového rámce, konkrétní události nebo aktivity',
    isAvailable: true,
  },
  {
    type: 'workflow',
    icon: 'glass-martini-alt',
    label: 'Pracovní postup',
    description:
      'Zaregistrujte se do jiného pracovního postupu, spusťte odchozí webhook nebo napište vlastní kód',
    isAvailable: false,
  },
  {
    type: 'sendEmail',
    icon: 'fast-mail',
    label: 'Poslat E-mailem',
    description: 'Send Email',
    emailRecipientsConst: EMAIL_RECIPIENTS_TYPES,
    isAvailable: true,
  },
];

export const STATUSES = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  ARCHIVED: 'archived',
};
