// css
import "./index.css";

import {
  generateIntegrationUrl,
  getStorage,
  listenForCommonRequests,
  setSaasHQProperty
} from "../../widgetUtils";

declare const window: any;

/*
 * Messenger message's embeddable script
 */

// check is mobile
const isMobile =
  navigator.userAgent.match(/iPhone/i) ||
  navigator.userAgent.match(/iPad/i) ||
  navigator.userAgent.match(/Android/i);

let viewportMeta: any;
let newViewportMeta: any;
let hideDelayTimer: any;

const delay = 350;

if (isMobile) {
  viewportMeta = document.querySelector('meta[name="viewport"]');
}

function renewViewPort() {
  if (viewportMeta) {
    document.getElementsByTagName("head")[0].removeChild(viewportMeta);
  }

  newViewportMeta = document.createElement("meta");
  newViewportMeta.name = "viewport";
  newViewportMeta.content =
    "initial-scale=1, user-scalable=0, maximum-scale=1, width=device-width";
  document.getElementsByTagName("head")[0].appendChild(newViewportMeta);
}

function revertViewPort() {
  if (newViewportMeta) {
    document.getElementsByTagName("head")[0].removeChild(newViewportMeta);
  }

  if (viewportMeta) {
    document.getElementsByTagName("head")[0].appendChild(viewportMeta);
  }
}

function delaydToggleClass(str: string, isVisible: boolean) {
  hideDelayTimer = setTimeout(() => {
    saashqContainer.classList.toggle(str, isVisible);
  }, delay);
}

function delaydSetClass(str: string) {
  hideDelayTimer = setTimeout(() => {
    saashqContainer.className = str;
  }, delay);
}

function clearTimer() {
  if (hideDelayTimer) {
    clearTimeout(hideDelayTimer);
  }
}

const iframeId = "saashq-messenger-iframe";
const container = "saashq-messenger-container";

// container
const saashqContainer = document.createElement("div");
saashqContainer.id = container;
saashqContainer.className = "saashq-messenger-hidden";

// add iframe
const iframe: any = document.createElement("iframe");

iframe.id = iframeId;
iframe.src = generateIntegrationUrl("messenger");
iframe.style.display = "none";
iframe.allow = "camera *;microphone *";

saashqContainer.appendChild(iframe);
document.body.appendChild(saashqContainer);

// after iframe load send connection info
iframe.onload = async () => {
  iframe.style.display = "block";

  const contentWindow = iframe.contentWindow;

  if (!contentWindow) {
    return;
  }

  const setting = window.saashqSettings.messenger;

  setSaasHQProperty("showMessenger", () => {
    contentWindow.postMessage(
      {
        fromPublisher: true,
        action: "showMessenger"
      },
      "*"
    );
  });

  contentWindow.postMessage(
    {
      fromPublisher: true,
      setting,
      storage: getStorage()
    },
    "*"
  );
};

// listen for widget toggle
window.addEventListener("message", async (event: MessageEvent) => {
  const data = event.data;
  const { isVisible, message, isSmallContainer } = data;

  listenForCommonRequests(event, iframe);

  if (data.fromSaasHQ && data.source === "fromMessenger") {
    if (isMobile) {
      document.body.classList.toggle("widget-mobile", isVisible);
    }

    if (message === "messenger") {
      if (isMobile && isVisible) {
        renewViewPort();
      } else {
        revertViewPort();
      }

      clearTimer();

      if (isVisible) {
        saashqContainer.className = "saashq-messenger-shown";
      } else {
        delaydSetClass("saashq-messenger-hidden");
      }

      saashqContainer.classList.toggle("small", isSmallContainer);
      document.body.classList.toggle("messenger-widget-shown", isVisible);
    }

    if (message === "notifier") {
      clearTimer();
      delaydToggleClass("saashq-notifier-shown", isVisible);

      // change container div dimension
      if (!isVisible) {
        delaydSetClass("saashq-messenger-hidden");
      }
    }

    if (message === "notifierFull") {
      clearTimer();

      // add class and hide notifier
      if (isVisible) {
        saashqContainer.className += " saashq-notifier-shown fullMessage";
      } else {
        delaydSetClass("saashq-messenger-hidden");
      }
    }
  }
});
