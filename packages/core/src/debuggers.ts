import * as debug from 'debug';

export const debugExternalApi = debug('saashq-api:external-api-fetcher');
export const debugInit = debug('saashq-api:init');
export const debugCrons = debug('saashq-crons:');
export const debugWorkers = debug('saashq-workers:');
export const debugDb = debug('saashq-api:db');
export const debugImport = debug('saashq-api:import');
export const debugBase = debug('saashq-api:base');
export const debugEmail = debug('saashq-api:email');
export const debugError = debug('saashq-api:error');

export const debugRequest = (debugInstance, req) =>
  debugInstance(`
        Receiving ${req.path} request from ${req.headers.origin}
        header: ${JSON.stringify(req.headers || {})}
        body: ${JSON.stringify(req.body || {})}
        queryParams: ${JSON.stringify(req.query)}
    `);

export const debugResponse = (debugInstance, req, data = 'success') =>
  debugInstance(
    `Responding ${req.path} request to ${req.headers.origin} with ${data}`
  );
