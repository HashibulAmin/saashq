import { isEnabled } from './core';

const menuInbox = [{ title: 'Týmová Schránka', link: '/inbox/index' }];

const menuDeal = [{ title: 'Sales pipeline', link: '/deal/board' }];

const menuContacts = [
  { title: 'Leads', link: '/contacts/lead' },
  { title: 'Customers', link: '/contacts/customer' },
  { title: 'Companies', link: '/companies' },
  isEnabled('clientportal')
    ? {
        title: 'Client Portal Users',
        link: '/settings/client-portal/user',
      }
    : { title: '', link: '' },
  isEnabled('clientportal')
    ? {
        title: 'Vendor Portal Users',
        link: '/settings/vendor-portal/user',
      }
    : { title: '', link: '' },
];

export { menuContacts, menuInbox, menuDeal };
