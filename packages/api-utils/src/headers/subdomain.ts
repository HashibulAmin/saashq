import { IncomingMessage } from 'http';

export const saashqSubdomainHeaderName = 'saashq-subdomain';

export const getSubomdainHeader = (
  req: IncomingMessage,
): string | undefined => {
  const subdomainHeader = req.headers[saashqSubdomainHeaderName];
  if (Array.isArray(subdomainHeader)) {
    throw new Error(`Multiple ${saashqSubdomainHeaderName} headers!`);
  }
  return subdomainHeader;
};
