import debug from 'debug';

export let debugInfo;
export let debugError;

export function initDebuggers(configs: any) {
  debugInfo = debug(`saashq-${configs.name}:info`);
  debugError = debug(`saashq-${configs.name}:error`);
}
