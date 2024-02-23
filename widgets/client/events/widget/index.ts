/*
 * Event's embeddable script
 */

import { generateIntegrationUrl, getStorage, setSaasHQProperty } from "../../widgetUtils";

// add iframe
const iframe = document.createElement("iframe");

iframe.src = generateIntegrationUrl("events");
iframe.style.display = "none";

document.body.appendChild(iframe);

// after iframe load send connection info
iframe.onload = async () => {
  const contentWindow = iframe.contentWindow;

  if (!contentWindow) {
    return;
  }

  const sendMessage = (action: string, args: any) => {
    contentWindow.postMessage(
      {
        fromPublisher: true,
        action,
        storage: getStorage(),
        args
      },
      "*"
    );
  };

  setSaasHQProperty("identifyCustomer", (args: any) => {
    sendMessage("identifyCustomer", args);
  });

  setSaasHQProperty("updateCustomerProperties", (data: Array<{ name: string, value: any }>) => {
    sendMessage("updateCustomerProperties", data);
  });

  setSaasHQProperty("sendEvent", (args: any) => {
    sendMessage("sendEvent", args);
  });

  sendMessage("init", { url: window.location.href });
};
