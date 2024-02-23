import debug from 'debug';

export const debugInit = debug('saashq-engages:init');
export const debugDb = debug('saashq-engages:db');
export const debugBase = debug('saashq-engages:base');
export const debugEngages = debug('saashq-engages:engages');
export const debugError = debug('saashq-engages:error');

export const debugRequest = (debugInstance, req) =>
  debugInstance(`
        Receiving ${req.path} request from ${req.headers.origin}
        body: ${JSON.stringify(req.body || {})}
        queryParams: ${JSON.stringify(req.query)}
    `);
