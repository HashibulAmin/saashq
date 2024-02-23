import * as debug from 'debug';

export const debugInit = debug('saashq-integrations:init');
export const debugDb = debug('saashq-integrations:db');
export const debugCrons = debug('saashq-integrations-crons:');
export const debugBase = debug('saashq-integrations:base');
export const debugIntegrations = debug('saashq-integrations:integrations');
export const debugFacebook = debug('saashq-integrations:facebook');
export const debugTwitter = debug('saashq-integrations:twitter');
export const debugGmail = debug('saashq-integrations:gmail');
export const debugCallPro = debug('saashq-integrations:callpro');
export const debugChatfuel = debug('saashq-integrations:chatfuel');
export const debugNylas = debug('saashq-integrations:nylas');
export const debugWhatsapp = debug('saashq-integrations:whatsapp');
export const debugExternalRequests = debug(
  'saashq-integrations:external-requests'
);
export const debugInstagram = debug('saashq-integrations:instagram');
export const debugDaily = debug('saashq-integrations:daily');
export const debugSmooch = debug('saashq-integrations:smooch');
export const debugTelnyx = debug('saashq-integrations:telnyx');
export const debugError = debug('saashq-integrations:error');

export const debugRequest = (debugInstance, req) =>
  debugInstance(`
        Receiving ${req.path} request from ${req.headers.origin}
        body: ${JSON.stringify(req.body || {})}
        queryParams: ${JSON.stringify(req.query)}
      `);

export const debugResponse = (debugInstance, req, data = 'success') =>
  debugInstance(
    `Responding ${req.path} request to ${req.headers.origin} with ${data}`
  );
