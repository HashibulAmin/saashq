export const OS_SERVICES = [
  {
    name: 'Podpora',
    description:
      'Získejte technickou podporu prostřednictvím e-mailu a chatu v aplikaci pro nastavení a používání SaasHQ',
    type: 'supportService',
    price: '20',
    logo: '/static/images/plan-icons/support-service.png',
  },
  {
    name: 'Poradenství pro úspěch zákazníků',
    description:
      'Měsíční sezení s konzultantem pro úspěch zákazníků, který vám poskytne rady ohledně vašeho SaasHQ',
    type: 'supportService2',
    price: '40',
    logo: '/static/images/plan-icons/customer-success.png',
  },
  {
    name: 'Instalační služba',
    description:
      'Získejte technickou podporu pro nastavení a používání SsaasHQ',
    type: 'setupService',
    price: '50',
    logo: '/static/images/plan-icons/setupService.svg',
  },
  {
    name: 'Značka společnosti',
    description: 'Odlište se pomocí značky vaší společnosti a vlastní domény',
    type: 'whiteLabel',
    price: '5',
    logo: '/static/images/plan-icons/rgb.svg',
  },
];

export const CATEGORIES = [
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Odbyt' },
  { value: 'services', label: 'Služby' },
  { value: 'operations', label: 'Operace' },
  { value: 'communications', label: 'Komunikace' },
  { value: 'productivity', label: 'Produktivita' },
  { value: 'website', label: 'Webová stránka' },
  { value: 'e-commerce', label: 'Elektronický obchod' },
  { value: 'document', label: 'Správa dokumentů' },
  { value: 'hr', label: 'Lidské zdroje' },
  { value: 'finance', label: 'Finance' },
  { value: 'inventory', label: 'Inventář' },
  { value: 'analytics', label: 'Analytiky' },
  { value: 'reporting', label: 'Hlášení' },
];

export const STATUS_TYPES = [
  { value: 'All' },
  { value: 'Free' },
  { value: 'Paid' },
];
