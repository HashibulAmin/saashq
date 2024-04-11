import { debugInfo } from '../debuggers';

export const getEnv = ({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}): string => {
  const value = process.env[name];

  if (!value && typeof defaultValue !== 'undefined') {
    return defaultValue;
  }

  if (!value) {
    debugInfo(`Chybí konfigurace proměnné prostředí pro ${name}`);
  }

  return value || '';
};
