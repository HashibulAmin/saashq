import debug from 'debug';

export const debugInfo = debug(`saashq:info`);
export const debugError = debug(`saashq:error`);

export const wrapper = instance => {
  return debug(instance);
};

export const debugBase = wrapper('saashq-api');
export const debugExternalApi = wrapper('saashq-api:external-api-fetcher');
export const debugEmail = wrapper('saashq-api:email');
