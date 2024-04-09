import colors from '@saashq/ui/src/styles/colors';
export const EMAIL_CONTENT_CLASS = 'saashq-email-content';
export const EMAIL_CONTENT_PLACEHOLDER = `<div class="${EMAIL_CONTENT_CLASS}"></div>`;

export const MESSAGE_KINDS = {
  AUTO: 'auto',
  VISITOR_AUTO: 'návštěvníkAuto',
  MANUAL: 'manuál',
  ALL_LIST: ['auto', 'návštěvníkAuto', 'manuál'],
};

export const statusFilters = [
  { key: 'live', value: 'Žít' },
  { key: 'draft', value: 'návrh' },
  { key: 'paused', value: 'Pozastaveno' },
  { key: 'yours', value: 'Vaše zprávy' },
];

export const MESSAGE_KIND_FILTERS = [
  { name: 'auto', text: 'Auto' },
  { name: 'visitorAuto', text: 'Návštěvnické auto' },
  { name: 'manual', text: 'Manuál' },
];

export const MESSENGER_KINDS = {
  CHAT: 'povídat si',
  NOTE: 'poznámka',
  POST: 'pošta',
  ALL_LIST: ['povídat si', 'poznámka', 'pošta'],
  SELECT_OPTIONS: [
    { value: 'chat', text: 'Povídat si' },
    { value: 'note', text: 'Poznámka' },
    { value: 'post', text: 'Pošta' },
  ],
};

export const METHODS = {
  MESSENGER: 'posel',
  EMAIL: 'e-mailem',
  SMS: 'sms',
  NOTIFICATION: 'oznámení',
  ALL_LIST: ['posel', 'e-mailem', 'sms', 'oznámení'],
};

export const SENT_AS_CHOICES = {
  BADGE: 'odznak',
  SNIPPET: 'úryvek',
  FULL_MESSAGE: 'celá zpráva',
  ALL_LIST: ['odznak', 'úryvek', 'celá zpráva'],
  SELECT_OPTIONS: [
    { value: 'badge', text: 'Odznak' },
    { value: 'snippet', text: 'Úryvek' },
    { value: 'fullMessage', text: 'Zobrazit celou zprávu' },
  ],
};

export const SCHEDULE_TYPES = [
  { value: 'pre', label: 'Plán na později' },
  { value: 'minute', label: 'Každou minutu' },
  { value: 'hour', label: 'Každou hodinu' },
  { value: 'day', label: 'Každý den' },
  { value: 'month', label: 'Každý měsíc' },
  { value: 'year', label: 'Každý rok' },
  { value: 1, label: 'Každé pondělí' },
  { value: 2, label: 'Každé úterý' },
  { value: 3, label: 'Každou středu' },
  { value: 4, label: 'Každý čtvrtek' },
  { value: 5, label: 'Každý pátek' },
  { value: 6, label: 'Každou sobotu' },
  { value: 0, label: 'Každou neděli' },
];

export const SMS_DELIVERY_STATUSES = {
  QUEUED: 've frontě',
  SENDING: 'odesílání',
  SENT: 'odesláno',
  DELIVERED: 'doručeno',
  SENDING_FAILED: 'odeslání_se nezdařilo',
  DELIVERY_FAILED: 'dodání_selhalo',
  DELIVERY_UNCONFIRMED: 'doručení_nepotvrzeno',
  WEBHOOK_DELIVERED: 'webhook_doručen',
  ERROR: 'chyba',
  ALL: [
    've frontě',
    'odesílání',
    'odesláno',
    'doručeno',
    'odeslání_se nezdařilo',
    'dodání selhalo',
    'doručení_nepotvrzeno',
    'webhook_doručen',
    'chyba',
  ],
  OPTIONS: [
    {
      value: 'queued',
      label: 'Ve frontě',
      icon: 'list-ul',
      description: `Zpráva je zařazena do fronty na straně Telnyxu`,
      color: colors.colorCoreGray,
    },
    {
      value: 'sending',
      label: 'Odesílání',
      icon: 'comment-alt-message',
      description: 'Zpráva se aktuálně odesílá poskytovateli upstream',
      color: colors.colorCoreTeal,
    },
    {
      value: 'sent',
      label: 'Odesláno',
      icon: 'send',
      description: 'Zpráva byla odeslána poskytovateli upstream',
      color: colors.colorCoreBlue,
    },
    {
      value: 'delivered',
      label: 'Doručeno',
      icon: 'checked',
      description: 'Upstream poskytovatel potvrdil doručení zprávy',
      color: colors.colorCoreGreen,
    },
    {
      value: 'sending_failed',
      label: 'Odeslání se nezdařilo',
      icon: 'comment-alt-block',
      description:
        'Telnyxu se nepodařilo odeslat zprávu poskytovateli upstream',
      color: colors.colorCoreRed,
    },
    {
      value: 'delivery_failed',
      label: 'Dodání selhalo',
      icon: 'multiply',
      description:
        'Upstream poskytovateli se nepodařilo odeslat zprávu příjemci',
      color: colors.colorCoreYellow,
    },
    {
      value: 'delivery_unconfirmed',
      label: 'Doručení nepotvrzeno',
      icon: 'comment-alt-question',
      description: 'Neexistuje žádná indikace, zda zpráva dorazila k příjemci',
      color: colors.colorCoreYellow,
    },
    {
      value: 'webhook_delivered',
      label: 'Doručeno přes webhook',
      icon: 'checked',
      description: 'Doručeno prostřednictvím nakonfigurovaného webhooku',
      color: colors.colorCoreGreen,
    },
    {
      value: 'error',
      label: 'Vyskytla se chyba',
      icon: 'times-circle',
      description: 'Vyskytla se chyba',
      color: colors.colorCoreRed,
    },
  ],
};

export const AWS_EMAIL_DELIVERY_STATUSES = {
  SEND: 'poslat',
  DELIVERY: 'dodávka',
  OPEN: 'otevřít',
  CLICK: 'klikněte',
  COMPLAINT: 'stížnost',
  BOUNCE: 'odskočit',
  RENDERING_FAILURE: 'selhání vykreslování',
  REJECT: 'odmítnout',
  OPTIONS: [
    {
      value: 'send',
      label: 'Odesláno',
      description:
        'Volání do Amazon SES bylo úspěšné a Amazon SES se pokusí doručit e-mail',
      icon: 'telegram-alt',
    },
    {
      value: 'delivery',
      label: 'Doručeno',
      description: `Amazon SES úspěšně doručil e-mail na poštovní server příjemce`,
      icon: 'comment-check',
    },
    {
      value: 'open',
      label: 'Otevřeno',
      description:
        'Příjemce přijal zprávu a otevřel ji ve svém e-mailovém klientovi',
      icon: 'envelope-open',
    },
    {
      value: 'click',
      label: 'Kliknuto',
      description: 'Příjemce klikl na jeden nebo více odkazů v e-mailu',
      icon: 'mouse-alt',
    },
    {
      value: 'complaint',
      label: 'Stížnost/spam',
      description:
        'E-mail byl úspěšně doručen příjemci. Příjemce označil e-mail jako spam',
      icon: 'frown',
    },
    {
      value: 'bounce',
      label: 'Odskočit',
      description: `Poštovní server příjemce e-mail trvale odmítl`,
      icon: 'arrows-up-right',
    },
    {
      value: 'reject',
      label: 'Odmítnuto',
      description:
        'Amazon SES přijal e-mail, zjistil, že obsahuje virus, a odmítl jej',
      icon: 'times-circle',
    },
    {
      value: 'renderingfailure',
      label: 'Selhání vykreslování',
      description: `E-mail nebyl odeslán kvůli problému s vykreslováním šablony`,
      icon: 'ban',
    },
  ],
};

export const NOTIFICATION_DELIVERY_STATUSES = {
  SENT: 'odesláno',
  READ: 'číst',
  UNREAD: 'nepřečtený',
  OPTIONS: [
    {
      value: 'sent',
      label: 'Odesláno',
      description: 'Oznámení bylo úspěšně odesláno příjemci',
      icon: 'telegram-alt',
    },
    {
      value: 'read',
      label: 'Číst',
      description: 'Příjemce obdržel oznámení a otevřel jej',
      icon: 'envelope-open',
    },
    {
      value: 'unread',
      label: 'Nepřečtený',
      description: 'Příjemce oznámení ještě neotevřel',
      icon: 'envelope',
    },
  ],
};

export const CAMPAIGN_TARGET_TYPES = {
  SEGMENT: 'segmenty:segment',
  TAG: 'značky:štítek',
  BRAND: 'jádro: značka',
  ALL: ['segmenty:segment', 'značky:štítek', 'jádro: značka'],
};

export const BUSINESS_PORTAL_KINDS = {
  CLIENT: 'klienta',
  VENDOR: 'prodejce',
  ALL: ['klienta', 'prodejce'],
};
