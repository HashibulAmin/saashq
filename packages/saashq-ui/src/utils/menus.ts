import { isEnabled } from './core';

const menuInbox = [{ title: 'Týmová Schránka', link: '/inbox/index' }];

const menuDeal = [{ title: 'Sales pipeline', link: '/deal/board' }];

const menuContacts = [
  { title: 'Vede', link: '/contacts/lead' },
  { title: 'Zákazníci', link: '/contacts/customer' },
  { title: 'Společnosti', link: '/companies' },
  isEnabled('clientportal')
    ? {
        title: 'Uživatelé klientského portálu',
        link: '/settings/client-portal/user',
      }
    : { title: '', link: '' },
  isEnabled('clientportal')
    ? {
        title: 'Uživatelé portálu dodavatele',
        link: '/settings/vendor-portal/user',
      }
    : { title: '', link: '' },
];

export { menuContacts, menuInbox, menuDeal };
