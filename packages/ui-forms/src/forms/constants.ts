const stringTypeChoices = [
  { value: '', label: '' },
  { value: 'is', label: 'je' },
  { value: 'isNot', label: 'není' },
  { value: 'startsWith', label: 'začíná s' },
  { value: 'endsWith', label: 'končí s' },
  { value: 'contains', label: 'obsahuje' },
  { value: 'doesNotContain', label: 'neobsahuje' },
  { value: 'isUnknown', label: 'je neznámý' },
  { value: 'hasAnyValue', label: 'má nějakou hodnotu' },
];

const numberTypeChoices = [
  { value: '', label: '' },
  { value: 'greaterThan', label: 'větší než' },
  { value: 'lessThan', label: 'méně než' },
  { value: 'is', label: 'rovnat se' },
  { value: 'isNot', label: 'ne rovné' },
  { value: 'isUnknown', label: 'je neznámý' },
  { value: 'hasAnyValue', label: 'má nějakou hodnotu' },
];

const dateTypeChoices = [
  { value: '', label: '' },
  { value: 'dateGreaterThan', label: 'Větší než' },
  { value: 'dateLessThan', label: 'Méně než' },
];

export { numberTypeChoices, stringTypeChoices, dateTypeChoices };
