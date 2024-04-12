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
        Příjem ${req.path} žádost od ${req.headers.origin}
        záhlaví: ${JSON.stringify(req.headers || {})}
        tělo: ${JSON.stringify(req.body || {})}
        queryParams: ${JSON.stringify(req.query)}
    `);

export const debugResponse = (debugInstance, req, data = 'success') =>
  debugInstance(
    `Reagovat ${req.path} požadavek na ${req.headers.origin} s ${data}`,
  );
