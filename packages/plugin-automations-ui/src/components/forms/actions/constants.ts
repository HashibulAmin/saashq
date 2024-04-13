export const PROPERTY_FIELD = [
  {
    value: 'size',
    label: 'Velikost',
  },
  {
    value: 'amount',
    label: 'Množství',
  },
  {
    value: 'state',
    label: 'Stát',
  },
];

export const PROPERTY_OPERATOR = {
  String: [
    {
      value: 'set',
      label: 'Soubor',
    },
    {
      value: 'concat',
      label: 'Concat',
    },
  ],
  Date: [
    {
      value: 'set',
      label: 'Soubor',
    },
    {
      value: 'addDay',
      label: 'Přidat Den',
    },
    {
      value: 'subtractDay',
      label: 'Odečíst Den',
    },
  ],
  Number: [
    {
      value: 'add',
      label: 'Přidat',
    },
    {
      value: 'subtract',
      label: 'Odčítat',
    },
    {
      value: 'multiply',
      label: 'Násobit',
    },
    {
      value: 'divide',
      label: 'Rozdělit',
    },
    {
      value: 'set',
      label: 'Soubor',
    },
  ],
  Default: [
    {
      value: 'set',
      label: 'Soubor',
    },
  ],
};
