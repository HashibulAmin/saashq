import { IncomingHttpHeaders } from 'http';
import { userHeaderName } from './user';
import { saashqSubdomainHeaderName } from './subdomain';

export function sanitizeHeaders(headers: IncomingHttpHeaders) {
  delete headers[saashqSubdomainHeaderName];
  delete headers[userHeaderName];
  delete headers['userid'];
}
