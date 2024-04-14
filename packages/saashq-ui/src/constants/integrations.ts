import { __ } from '@saashq/ui/src/utils';

export const days = [
  { value: 'everyday', label: __('Každý den') },
  { value: 'weekdays', label: __('Všední dny') },
  { value: 'weekends', label: __('Víkendy') },
  { value: 'monday', label: __('Pondělí') },
  { value: 'tuesday', label: __('úterý') },
  { value: 'wednesday', label: __('Středa') },
  { value: 'thursday', label: __('Čtvrtek') },
  { value: 'friday', label: __('Pátek') },
  { value: 'saturday', label: __('Sobota') },
  { value: 'sunday', label: __('Neděle') },
];

export const hours = [
  { value: '12:00 AM', label: '12:00 AM' },
  { value: '12:30 AM', label: '12:30 AM' },
  { value: '1:00 AM', label: '1:00 AM' },
  { value: '1:30 AM', label: '1:30 AM' },
  { value: '2:00 AM', label: '2:00 AM' },
  { value: '2:30 AM', label: '2:30 AM' },
  { value: '3:00 AM', label: '3:00 AM' },
  { value: '3:30 AM', label: '3:30 AM' },
  { value: '4:00 AM', label: '4:00 AM' },
  { value: '4:30 AM', label: '4:30 AM' },
  { value: '5:00 AM', label: '5:00 AM' },
  { value: '5:30 AM', label: '5:30 AM' },
  { value: '6:00 AM', label: '6:00 AM' },
  { value: '6:30 AM', label: '6:30 AM' },
  { value: '7:00 AM', label: '7:00 AM' },
  { value: '7:30 AM', label: '7:30 AM' },
  { value: '8:00 AM', label: '8:00 AM' },
  { value: '8:30 AM', label: '8:30 AM' },
  { value: '9:00 AM', label: '9:00 AM' },
  { value: '9:30 AM', label: '9:30 AM' },
  { value: '10:00 AM', label: '10:00 AM' },
  { value: '10:30 AM', label: '10:30 AM' },
  { value: '11:00 AM', label: '11:00 AM' },
  { value: '11:30 AM', label: '11:30 AM' },
  { value: '12:00 PM', label: '12:00 PM' },
  { value: '12:30 PM', label: '12:30 PM' },
  { value: '1:00 PM', label: '1:00 PM' },
  { value: '1:30 PM', label: '1:30 PM' },
  { value: '2:00 PM', label: '2:00 PM' },
  { value: '2:30 PM', label: '2:30 PM' },
  { value: '3:00 PM', label: '3:00 PM' },
  { value: '3:30 PM', label: '3:30 PM' },
  { value: '4:00 PM', label: '4:00 PM' },
  { value: '4:30 PM', label: '4:30 PM' },
  { value: '5:00 PM', label: '5:00 PM' },
  { value: '5:30 PM', label: '5:30 PM' },
  { value: '6:00 PM', label: '6:00 PM' },
  { value: '6:30 PM', label: '6:30 PM' },
  { value: '7:00 PM', label: '7:00 PM' },
  { value: '7:30 PM', label: '7:30 PM' },
  { value: '8:00 PM', label: '8:00 PM' },
  { value: '8:30 PM', label: '8:30 PM' },
  { value: '9:00 PM', label: '9:00 PM' },
  { value: '9:30 PM', label: '9:30 PM' },
  { value: '10:00 PM', label: '10:00 PM' },
  { value: '10:30 PM', label: '10:30 PM' },
  { value: '11:00 PM', label: '11:00 PM' },
  { value: '11:30 PM', label: '11:30 PM' },
  { value: '11:59 PM', label: '11:59 PM' },
];

export const INTEGRATION_KINDS = {
  MESSENGER: 'posel',
  FACEBOOK_MESSENGER: 'facebook-messenger',
  INSTAGRAM_MESSENGER: 'instagram-messenger',
  FACEBOOK_POST: 'facebook-post',
  FORMS: 'Vést',
  CALLPRO: 'callpro',
  WEBHOOK: 'webhook',
  BOOKING: 'rezervace',
  ALL: [
    { text: 'Posel', value: 'messenger' },
    { text: 'Formuláře', value: 'lead' },
    {
      text: 'Facebook Messenger',
      value: 'facebook-messenger',
    },
    {
      text: 'Instagram Messenger',
      value: 'instagram-messenger',
    },
    { text: 'Webhook', value: 'webhook' },
    { text: 'Callpro', value: 'callpro' },
    { text: 'Rezervace', value: 'booking' },
  ],
};

export const FORM_LOAD_TYPES = {
  SHOUTBOX: 'křikbox',
  POPUP: 'vyskakovat',
  EMBEDDED: 'vložené',
  ALL_LIST: ['', 'křikbox', 'vyskakovat', 'vložené'],
};

export const FORM_SUCCESS_ACTIONS = {
  EMAIL: 'e-mailem',
  REDIRECT: 'přesměrovat',
  ONPAGE: 'na stránce',
  ALL_LIST: [
    { text: 'Na stránce', value: 'onPage' },
    { text: 'E-mailem', value: 'email' },
    { text: 'Přesměrování stránky', value: 'redirect' },
  ],
};

export const MAIL_TOOLBARS_CONFIG = [
  'fontSize',
  '|',
  'color',
  'highlight',
  'bold',
  'italic',
  'underline',
  'orderedList',
  'bulletList',
  '|',
  'link',
  'unlink',
];

export const INTEGRATIONS = [
  {
    name: 'Posel',
    description:
      'Prohlížení zpráv Messengeru a odpovídání na ně ve vaší týmové schránce',
    inMessenger: false,
    isAvailable: true,
    kind: 'messenger',
    logo: '/images/integrations/messenger.png',
    createModal: 'messenger',
    createUrl: '/settings/integrations/createMessenger',
    category:
      'Všechny integrace, Pro týmy podpory, Pro marketingové týmy, Marketingová automatizace, Konverzace',
  },
  {
    name: 'Call Pro',
    description: 'Připojte své telefonní číslo call pro',
    inMessenger: false,
    isAvailable: true,
    kind: 'callpro',
    logo: '/images/integrations/callpro.png',
    createModal: 'callpro',
    category:
      'Všechny integrace, Pro týmy podpory, Marketingová automatizace, Telefon a video, Konverzace',
  },
  {
    name: 'Příchozí webhook',
    description: 'Konfigurace příchozích webhooků',
    inMessenger: false,
    isAvailable: true,
    kind: 'webhook',
    logo: '/images/integrations/incoming-webhook.png',
    createModal: 'webhook',
    category:
      'Všechny integrace, pro týmy podpory, konverzace, automatizace marketingu',
  },
];

export const WEBHOOK_DOC_URL = 'https://docs.saashq.io/';
