import {
  getService,
  getServices,
} from '@saashq/api-utils/src/serviceDiscovery';
import retry from '../util/retry';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
dotenv.config();

export type SaasHQProxyTarget = {
  name: string;
  address: string;
  config: any;
};

const { MAX_PLUGIN_RETRY } = process.env;

const maxPluginRetry = Number(MAX_PLUGIN_RETRY) || Number.MAX_SAFE_INTEGER;

async function getProxyTarget(name: string): Promise<SaasHQProxyTarget> {
  const service = await getService(name);

  if (!service.address) {
    throw new Error(
      `Zapojit ${name} nemá žádnou hodnotu adresy při zjišťování služby`,
    );
  }
  return {
    name,
    address: service.address,
    config: service.config,
  };
}

async function retryGetProxyTarget(name: string): Promise<SaasHQProxyTarget> {
  const intervalSeconds = 1;
  return retry({
    fn: () => getProxyTarget(name),
    intervalMs: intervalSeconds * 1000,
    maxTries: maxPluginRetry,
    retryExhaustedLog: `Zapojit ${name} po kontrole se stále nepřipojil k vyhledávání služby ${maxPluginRetry} čas(y) s ${intervalSeconds} sekundový (sekundový) interval. Opakujte vyčerpání.`,
    retryLog: `Waiting for plugin ${name} to join service discovery`,
    successLog: `Zapojit ${name} připojil objev služby.`,
  });
}

async function ensureGraphqlEndpointIsUp({
  address,
  name,
}: SaasHQProxyTarget): Promise<void> {
  if (!address) return;

  const endpoint = `${address}/graphql`;

  /*
    query: 'query SubgraphIntrospectQuery {\n' +
      '    # eslint-disable-next-line\n' +
      '    _service {\n' +
      '        sdl\n' +
      '    }\n' +
      '}',
  */

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      variables: null,
      query: `
          query SubgraphIntrospectQuery {
            _service {
              sdl
            }
          }
          `,
      operationName: 'SubgraphIntrospectQuery',
    }),
  });
  if (res.status === 200) {
    return;
  }

  throw new Error(
    `Zapojit ${name}'s koncový bod graphql ${endpoint} ještě není připraven`,
  );
}

async function retryEnsureGraphqlEndpointIsUp(target: SaasHQProxyTarget) {
  const { name, address } = target;
  const endpoint = `${address}/graphql`;
  const intervalSeconds = 1;
  await retry({
    fn: () => ensureGraphqlEndpointIsUp(target),
    intervalMs: intervalSeconds * 1000,
    maxTries: maxPluginRetry,
    retryExhaustedLog: `Zapojit ${name}'s koncový bod graphql ${endpoint} po kontrole stále není připraven ${maxPluginRetry} časy s ${intervalSeconds} sekundový (sekundový) interval. Opakujte vyčerpání.`,
    retryLog: `Waiting for service ${name}'s koncový bod graphql ${endpoint} být vzhůru.`,
    successLog: `Zapojit ${name}'s koncový bod graphql ${endpoint} je nahoře.`,
  });
}

export async function retryGetProxyTargets(): Promise<SaasHQProxyTarget[]> {
  try {
    const serviceNames = await getServices();

    const proxyTargets: SaasHQProxyTarget[] = await Promise.all(
      serviceNames.map(retryGetProxyTarget),
    );

    await Promise.all(proxyTargets.map(retryEnsureGraphqlEndpointIsUp));

    return proxyTargets;
  } catch (e) {
    console.log(e);
    console.error(e);
    process.exit(1);
  }
}
