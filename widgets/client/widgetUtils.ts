import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { ENV } from './types';

export const getEnv = (): ENV => {
  return (window as any).saashqEnv;
};

export const getStorage = () => {
  return localStorage.getItem("saashq") || "{}";
}

export const listenForCommonRequests = async (event: any, iframe: any) => {
  const { message, fromSaasHQ, source, key, value } = event.data;
  
  if (fromSaasHQ && iframe.contentWindow) {
    if (message === "requestingBrowserInfo") {
      iframe.contentWindow.postMessage(
        {
          fromPublisher: true,
          source,
          message: "sendingBrowserInfo",
          browserInfo: await getBrowserInfo()
        },
        "*"
      );
    }

    if (message === "setLocalStorageItem") {
      const saashqStorage = JSON.parse(localStorage.getItem("saashq") || "{}");

      saashqStorage[key] = value;

      localStorage.setItem("saashq", JSON.stringify(saashqStorage));
    }
  }
}

declare const window: any;

/*
 * Generate <host>/<integration kind> from <host>/<integration kind>Widget.bundle.js
 */
export const generateIntegrationUrl = (integrationKind: string): string => {
  const script =
    document.currentScript ||
    (() => {
      const scripts = document.getElementsByTagName('script');

      return scripts[scripts.length - 1];
    })();

  if (script && script instanceof HTMLScriptElement) {
    return script.src.replace(
      `/build/${integrationKind}Widget.bundle.js`,
      `/${integrationKind}`
    );
  }

  return '';
};

export const getBrowserInfo = async () => {
  if (window.location.hostname === 'localhost') {
    return {
      url: window.location.pathname,
      hostname: window.location.href,
      language: navigator.language,
      userAgent: navigator.userAgent,
      countryCode: 'CA',
    };
  }

  let location;

  try {
    const response = await fetch('https://geo.saashq.org');

    location = await response.json();
    
  } catch (e) {
    location = {
      city: '',
      remoteAddress: '',
      region: '',
      country: '',
      countryCode: ''
    };
  }

  return {
    remoteAddress: location.network,
    region: location.region,
    countryCode: location.countryCode,
    city: location.city,
    country: location.countryName,
    url: window.location.pathname,
    hostname: window.location.origin,
    language: navigator.language,
    userAgent: navigator.userAgent
  };
};

export const postMessage = (source: string, message: string, postData = {}) => {
  window.parent.postMessage(
    {
      fromSaasHQ: true,
      source,
      message,
      ...postData
    },
    '*'
  );
};

export const setSaasHQProperty = (name: string, value: any) => {
  const saashq = window.SaasHQ || {};

  saashq[name] = value;

  window.SaasHQ = saashq;
};

export const getVisitorId = async () => {
  const fp = await FingerprintJS.load();

  // The FingerprintJS agent is ready.
  const result = await fp.get();

  // This is the visitor identifier:
  return result.visitorId;
}
