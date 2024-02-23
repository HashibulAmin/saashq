import * as debug from 'debug';

export const debugInit = debug('saashq-facebook:init');
export const debugDb = debug('saashq-facebook:db');

export const debugBase = debug('saashq-facebook:base');
export const debugFacebook = debug('saashq-facebook:facebook');

export const debugExternalRequests = debug('saashq-facebook:external-requests');

export const debugError = debug('saashq-facebook:error');

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
