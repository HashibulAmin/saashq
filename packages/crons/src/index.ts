import * as schedule from 'node-schedule';
import { initBroker, sendCommonMessage } from './messageBroker';
import {
  getServices,
  getService,
  isEnabled,
} from '@saashq/api-utils/src/serviceDiscovery';

const sendMessage = async (
  subdomain: string,
  action: string,
  services: string[],
) => {
  for (const serviceName of services) {
    const service = await getService(serviceName);

    if ((await isEnabled(serviceName)) && service) {
      const meta = service.config ? service.config.meta : {};

      if (meta && meta.cronjobs && meta.cronjobs[`${action}Available`]) {
        sendCommonMessage({
          subdomain,
          serviceName,
          action,
          data: { subdomain },
        });
      }
    }
  }
};

initBroker()
  .then(async () => {
    console.log('Crons běží ....');

    const services = await getServices();
    const subdomain = 'os';

    // every minute at 1sec
    schedule.scheduleJob('1 * * * * *', async () => {
      console.log('každou minutu ....', services);

      await sendMessage(subdomain, 'handleMinutelyJob', services);
    });

    // every 10 minute at 1sec
    schedule.scheduleJob('*/10 * * * *', async () => {
      console.log('každých 10 minut ....', services);

      await sendMessage(subdomain, 'handle10MinutelyJob', services);
    });

    // every hour at 10min:10sec
    schedule.scheduleJob('10 10 * * * *', async () => {
      console.log('každou hodinu ....', services);

      await sendMessage(subdomain, 'handleHourlyJob', services);
    });

    // every day at 04hour:20min:20sec (UTC)
    schedule.scheduleJob('20 20 20 * * *', async () => {
      console.log('každý den ....', services);

      await sendMessage(subdomain, 'handleDailyJob', services);
    });
  })
  .catch((e) =>
    console.log(
      `Při inicializaci zprostředkovatele zpráv došlo k chybě ${e.message}`,
    ),
  );
