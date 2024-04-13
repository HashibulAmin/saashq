import { __ } from '@saashq/ui/src/utils/core';

export const CALENDAR_INTEGRATIONS = [
  {
    kind: 'nylas-gmail',
    name: 'Gmail podle Nylas',
  },
  {
    kind: 'nylas-office365',
    name: 'Office 365 podle Nylas',
  },
];

export const INTEGRATIONS = [
  {
    name: 'Facebook Post',
    description:
      'Připojte se k příspěvkům na Facebooku přímo ze svého Týmová Schránka',
    inMessenger: false,
    isAvailable: true,
    kind: 'facebook-post',
    logo: '/images/integrations/facebook.png',
    createModal: 'facebook-post',
    createUrl: '/settings/add-ons/createFacebook',
    category:
      'Všechny integrace, Pro týmy podpory, Marketingová automatizace, Sociální média',
  },
  {
    name: 'Facebook Messenger',
    description:
      'Připojte se a spravujte zprávy na Facebooku přímo ze svého Týmová Schránka',
    inMessenger: false,
    isAvailable: true,
    kind: 'facebook-messenger',
    logo: '/images/integrations/fb-messenger.png',
    createModal: 'facebook-messenger',
    createUrl: '/settings/add-ons/createFacebook',
    category:
      'Všechny integrace, Pro týmy podpory, Zprávy, Sociální média, Konverzace',
  },
  {
    name: 'Messenger',
    description:
      'Prohlížejte si zprávy Messengeru a odpovídejte na ně Týmová Schránka',
    inMessenger: false,
    isAvailable: true,
    kind: 'messenger',
    logo: '/images/integrations/messenger.png',
    createModal: 'messenger',
    createUrl: '/settings/add-ons/createMessenger',
    category:
      'Všechny integrace, Pro týmy podpory, Pro marketingové týmy, Marketingová automatizace, Konverzace',
  },
  {
    name: 'Gmail',
    description: __(
      'Připojte firemní e-mailovou adresu, například sales@mycompany.com nebo info@mycompany.com',
    ),
    inMessenger: false,
    isAvailable: true,
    kind: 'gmail',
    logo: '/images/integrations/gmail.png',
    createModal: 'gmail',
    createUrl: '/settings/add-ons/createGmail',
    category:
      'Všechny integrace, pro týmy podpory, e-mailový marketing, automatizace marketingu, konverzace',
  },
  {
    name: 'IMAP podle Nylas',
    description:
      'Připojte firemní e-mailovou adresu, například sales@mycompany.com nebo info@mycompany.com',
    inMessenger: false,
    isAvailable: true,
    kind: 'nylas-imap',
    logo: '/images/integrations/email.png',
    createModal: 'nylas-imap',
    createUrl: '/settings/add-ons/nylas-imap',
    category:
      'Všechny integrace, Pro týmy podpory, Marketingová automatizace, Email marketing',
  },
  {
    name: 'Office 365 podle Nylas',
    description:
      'Připojte firemní e-mailovou adresu, například sales@mycompany.com nebo info@mycompany.com',
    inMessenger: false,
    isAvailable: true,
    kind: 'nylas-office365',
    logo: '/images/integrations/office365.png',
    createModal: 'nylas-office365',
    createUrl: 'nylas/oauth2/callback',
    category:
      'Všechny integrace, pro týmy podpory, automatizace marketingu, e-mailový marketing, konverzace',
  },
  {
    name: 'Gmail podle Nylas',
    description:
      'Připojte firemní e-mailovou adresu, například sales@mycompany.com nebo info@mycompany.com',
    inMessenger: false,
    isAvailable: true,
    kind: 'nylas-gmail',
    logo: '/images/integrations/gmail.png',
    createModal: 'nylas-gmail',
    createUrl: 'nylas/oauth2/callback',
    category:
      'Všechny integrace, pro týmy podpory, e-mailový marketing, automatizace marketingu, konverzace',
  },
  {
    name: 'Microsoft Exchange podle Nylas',
    description:
      'Připojte firemní e-mailovou adresu, například sales@mycompany.com nebo info@mycompany.com',
    inMessenger: false,
    isAvailable: true,
    kind: 'nylas-exchange',
    logo: '/images/integrations/exchange.png',
    createModal: 'nylas-exchange',
    createUrl: '/settings/add-ons/nylas-exchange',
    category:
      'Všechny integrace, pro týmy podpory, e-mailový marketing, automatizace marketingu, konverzace',
  },
  {
    name: 'Outlook podle Nylas',
    description:
      'Připojte firemní e-mailovou adresu, například sales@mycompany.com nebo info@mycompany.com',
    inMessenger: false,
    isAvailable: true,
    kind: 'nylas-outlook',
    logo: '/images/integrations/outlook.png',
    createModal: 'nylas-outlook',
    createUrl: '/settings/add-ons/nylas-outlook',
    category:
      'Všechny integrace, Pro týmy podpory, Marketingová automatizace, Email marketing',
  },
  {
    name: 'Yahoo podle Nylas',
    description:
      'Připojte firemní e-mailovou adresu, například sales@mycompany.com nebo info@mycompany.com',
    inMessenger: false,
    isAvailable: true,
    kind: 'nylas-yahoo',
    logo: '/images/integrations/yahoo.png',
    createModal: 'nylas-yahoo',
    createUrl: '/settings/add-ons/nylas-yahoo',
    category:
      'Všechny integrace, pro týmy podpory, automatizace marketingu, e-mailový marketing, konverzace',
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
    name: 'Chatfuel',
    description: 'Připojte svůj chatfuel účet',
    inMessenger: false,
    isAvailable: true,
    kind: 'chatfuel',
    logo: '/images/integrations/chatfuel.png',
    createModal: 'chatfuel',
    category:
      'Všechny integrace, pro týmy podpory, automatizace marketingu, zasílání zpráv, konverzace',
  },
  {
    name: 'WhatsApp podle Smooch',
    description:
      'Získejte své zprávy Whatsapp prostřednictvím svého Týmová Schránka',
    inMessenger: false,
    isAvailable: true,
    kind: 'whatsapp',
    logo: '/images/integrations/whatsapp.png',
    createModal: 'whatsapp',
    category: 'Všechny integrace, pro týmy podpory, zasílání zpráv, konverzace',
  },
  {
    name: 'Telegram podle Smooch',
    description:
      'Připojte se ke svému Telegramu, cloudové mobilní a stolní aplikaci pro zasílání zpráv',
    inMessenger: false,
    isAvailable: true,
    kind: 'smooch-telegram',
    logo: '/images/integrations/telegram.png',
    createModal: 'smooch-telegram',
    category: 'Všechny integrace, pro týmy podpory, zasílání zpráv, konverzace',
  },
  {
    name: 'Viber podle Smooch',
    description: 'Připojte Viber k vašemu Týmová Schránka',
    inMessenger: false,
    isAvailable: true,
    kind: 'smooch-viber',
    logo: '/images/integrations/viber.png',
    createModal: 'smooch-viber',
    category:
      'Všechny integrace, pro týmy podpory, automatizace marketingu, zasílání zpráv, konverzace',
  },
  {
    name: 'Line podle Smooch',
    description:
      'Zobrazte a odpovídejte na řádkové zprávy ve svém Týmová Schránka',
    inMessenger: false,
    isAvailable: true,
    kind: 'smooch-line',
    logo: '/images/integrations/line.png',
    createModal: 'smooch-line',
    category:
      'Všechny integrace, Pro týmy podpory, Pro prodejní týmy, Pro marketingové týmy, Marketingová automatizace, Zprávy, Telefon a video, Konverzace',
  },
  {
    name: 'SMS podle Telnyx',
    description: 'Chcete-li odesílat a přijímat SMS, připojte svůj účet Telnyx',
    inMessenger: false,
    isAvailable: true,
    kind: 'telnyx',
    logo: '/images/integrations/telnyx.png',
    createModal: 'telnyx',
    category:
      'Všechny integrace, Pro týmy podpory, Pro marketingové týmy, Konverzace',
  },
  {
    name: 'Incoming Webhook',
    description: 'Konfigurace příchozích webhooků',
    inMessenger: false,
    isAvailable: true,
    kind: 'webhook',
    logo: '/images/integrations/incoming-webhook.png',
    createModal: 'webhook',
    category:
      'Všechny integrace, pro týmy podpory, konverzace, automatizace marketingu',
  },
  // {
  //   name: 'Outgoing Webhook',
  //   description: 'Konfigurace odchozích webhooků',
  //   inMessenger: false,
  //   isAvailable: true,
  //   kind: 'outgoing-webhook',
  //   logo: '/images/integrations/webhook.png',
  //   createModal: 'outgoing-webhook',
  //   category:
  //     'Všechny integrace, pro týmy podpory, konverzace, automatizace marketingu'
  // }
];
