const PROPERTY_GROUPS = [
  {
    label: 'Contacts',
    value: 'contact',
    types: [
      { value: 'customer', label: 'Zákazníci' },
      { value: 'company', label: 'Společnosti' },
      { value: 'conversation', label: 'Conversation details' },
      { value: 'device', label: 'Device properties' },
    ],
  },
  {
    label: 'Vstupenky',
    value: 'ticket',
    types: [{ value: 'ticket', label: 'Vstupenky' }],
  },
  { label: 'Úkoly', value: 'task', types: [{ value: 'task', label: 'Úkoly' }] },
  {
    label: 'Sales pipeline',
    value: 'deal',
    types: [
      { value: 'deal', label: 'Sales pipeline' },
      { value: 'product', label: 'Products & services' },
    ],
  },
  {
    label: 'Purchases pipeline',
    value: 'purchase',
    types: [
      { value: 'purchase', label: 'Purchases pipeline' },
      { value: 'product', label: 'Products & services' },
    ],
  },
  {
    label: 'Team member',
    value: 'user',
    types: [{ value: 'user', label: 'Team member' }],
  },
];

export const getPropertiesGroups = () => {
  const pluginProperties = JSON.parse(
    localStorage.getItem('plugins_properties') || '[]',
  );

  return PROPERTY_GROUPS.concat(pluginProperties);
};
