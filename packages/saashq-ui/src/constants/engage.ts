const stringTypeChoices = [
  { value: '', text: '' },
  { value: 'is', text: 'je' },
  { value: 'isNot', text: 'není' },
  { value: 'startsWith', text: 'začíná s' },
  { value: 'endsWith', text: 'končí s' },
  { value: 'contains', text: 'obsahuje' },
  { value: 'doesNotContain', text: 'neobsahuje' },
  { value: 'isUnknown', text: 'je neznámý' },
  { value: 'hasAnyValue', text: 'má nějakou hodnotu' },
];

const numberTypeChoices = [
  { value: '', text: '' },
  { value: 'greaterThan', text: 'Větší než' },
  { value: 'lessThan', text: 'Méně než' },
  { value: 'is', text: 'je' },
  { value: 'isNot', text: 'není' },
  { value: 'isUnknown', text: 'je neznámý' },
  { value: 'hasAnyValue', text: 'má nějakou hodnotu' },
];

export const RULE_CONDITIONS = {
  browserLanguage: stringTypeChoices,
  currentPageUrl: stringTypeChoices,
  country: stringTypeChoices,
  city: stringTypeChoices,
  numberOfVisits: numberTypeChoices,
};

export const VISITOR_AUDIENCE_RULES = [
  { value: '', text: '' },
  { value: 'browserLanguage', text: 'Jazyk prohlížeče' },
  { value: 'currentPageUrl', text: 'Adresa URL aktuální stránky' },
  { value: 'country', text: 'Země' },
  { value: 'city', text: 'Město' },
  { value: 'numberOfVisits', text: 'Počet návštěv' },
];
