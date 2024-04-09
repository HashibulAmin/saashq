import { ruleSchema } from '@saashq/api-utils/src/definitions/common';

import { channelSchema } from './models/definitions/channels';
import { responseTemplateSchema } from './models/definitions/responseTemplates';
import {
  calloutSchema,
  integrationSchema,
  leadDataSchema,
} from './models/definitions/integrations';

export const MODULE_NAMES = {
  CHANNEL: 'channel',
  EMAIL_TEMPLATE: 'emailTemplate',
  RESPONSE_TEMPLATE: 'responseTemplate',
  CONVERSATION: 'conversation',
  INTEGRATION: 'integration',
  SCRIPT: 'script',
};

export const LOG_MAPPINGS = [
  {
    name: MODULE_NAMES.CHANNEL,
    schemas: [channelSchema],
  },
  {
    name: MODULE_NAMES.RESPONSE_TEMPLATE,
    schemas: [responseTemplateSchema],
  },
  {
    name: MODULE_NAMES.INTEGRATION,
    schemas: [calloutSchema, integrationSchema, leadDataSchema, ruleSchema],
  },
];

export const CONVERSATION_INFO = {
  opened: 'Otevřeno',
  channels: 'Kanály',
  brand: 'Značka',
  integration: 'Integrace',
  count: 'Konverzace',
  ALL: [
    { field: 'opened', label: 'Otevřeno' },
    { field: 'channels', label: 'Kanály' },
    { field: 'brand', label: 'Značka' },
    { field: 'integration', label: 'Integrace' },
    { field: 'count', label: 'Konverzace' },
  ],
};

export const NOTIFICATION_MODULES = [
  {
    name: 'conversations',
    description: 'Konverzace',
    icon: 'chat',
    types: [
      {
        name: 'conversationStateChange',
        text: 'Změna stavu',
      },
      {
        name: 'conversationAssigneeChange',
        text: 'Změna příjemce',
      },
      {
        name: 'conversationAddMessage',
        text: 'Přidat zprávu',
      },
    ],
  },
  {
    name: 'channels',
    description: 'Kanály',
    icon: 'laptop',
    types: [
      {
        name: 'channelMembersChange',
        text: 'Členové se mění',
      },
    ],
  },
];

export const VERIFY_EMAIL_TRANSLATIONS = {
  en: 'Click here to verify your email',
  cs: 'Kliknutím sem ověřte svůj e-mail',
  mn: 'Имэйл хаягаа баталгаажуулахын тулд энд дарна уу',
  tr: 'E-postanızı doğrulamak için buraya tıklayın',
  zh: '点击此处验证您的电子邮件',
  es: 'Haga clic aquí para verificar su correo electrónico',
  pt: 'Clique aqui para verificar seu email',
  fr: 'Cliquez ici pour vérifier votre email',
  de: 'Klicken Sie hier, um Ihre E-Mail zu bestätigen',
  it: 'Clicca qui per verificare la tua email',
  ru: 'Нажмите здесь, чтобы подтвердить свой ​​электронный адрес',
  ja: 'ここをクリックしてメールアドレスを確認してください',
  nl: 'Klik hier om uw e-mail te verifiëren',
  ko: '이메일을 확인하려면 여기를 클릭하세요',
  ro: 'Faceți clic aici pentru a vă verifica adresa de email',
  pl: 'Kliknij tutaj, aby zweryfikować swój adres e-mail',
  hu: 'Kattintson ide az e-mail címének ellenőrzéséhez',
  sv: 'Klicka här för att verifiera din e-postadress',
};

export const IMPORT_EXPORT_TYPES = [
  {
    text: 'Konverzace',
    contentType: 'conversation',
    icon: 'chat',
  },
];
