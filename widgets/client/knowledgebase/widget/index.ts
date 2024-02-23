declare const window: any;

/*
 * Knowledge base's embeddable script
 */

// css
import { generateIntegrationUrl } from "../../widgetUtils";
import "./index.css";

// meta
const meta = document.createElement("meta");
meta.name = "viewport";
meta.content = "initial-scale=1, width=device-width";
document.getElementsByTagName("head")[0].appendChild(meta);

const iframeId = "saashq-knowledge-iframe";
const container = "saashq-knowledge-container";

// container
const saashqContainer = document.createElement("div");
saashqContainer.id = container;
saashqContainer.className = "";

// add iframe
const iframe = document.createElement("iframe");
iframe.id = iframeId;
iframe.src = generateIntegrationUrl("knowledgebase");
iframe.style.display = "none";

saashqContainer.appendChild(iframe);

const embedContainer = document.querySelector("[data-saashq-kbase]");

const trackIframe = () => {
  // after iframe load send connection info
  iframe.onload = () => {
    iframe.style.display = "block";

    if (iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        {
          fromPublisher: true,
          setting: window.saashqSettings.knowledgeBase
        },
        "*"
      );
    }
  };
};

if (!embedContainer) {
  console.log(
    'Please create a "div" element with an attribute named "data-saashq-kbase"'
  ); // eslint-disable-line
} else {
  embedContainer.appendChild(saashqContainer);
  trackIframe();
}
