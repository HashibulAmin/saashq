import { getSubdomain } from '@saashq/api-utils/src/core';
import * as dotenv from 'dotenv';
dotenv.config();

import { IModels, generateModels } from '../connectionResolver';

const widgetsMiddleware = async (req, res) => {
  const { WIDGETS_DOMAIN } = process.env;

  const domain = WIDGETS_DOMAIN || 'http://localhost:3200';

  const subdomain = getSubdomain(req);
  let models: IModels;
  try {
    models = await generateModels(subdomain);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }

  const script = await models.Scripts.findOne({ _id: req.query.id });

  if (!script) {
    return res.end('Not found');
  }

  const generateScript = (type) => {
    return `
      (function() {
        var script = document.createElement('script');
        script.src = "${domain}/build/${type}Widget.bundle.js";
        script.async = true;
        
        var entry = document.getElementsByTagName('script')[0];
        entry.parentNode.insertBefore(script, entry);
      })();
    `;
  };

  let saashqSettings = '{';
  let includeScripts = '';

  if (script.messengerBrandCode) {
    saashqSettings += `messenger: { brand_id: "${script.messengerBrandCode}" },`;
    includeScripts += generateScript('messenger');
  }

  if (script.kbTopicId) {
    saashqSettings += `knowledgeBase: { topic_id: "${script.kbTopicId}" },`;
    includeScripts += generateScript('knowledgebase');
  }

  if (script.leadMaps) {
    saashqSettings += 'forms: [';

    script.leadMaps.forEach((map) => {
      saashqSettings += `{ brand_id: "${map.brandCode}", form_id: "${map.formCode}" },`;
      includeScripts += generateScript('form');
    });

    saashqSettings += '],';
  }

  saashqSettings = `${saashqSettings}}`;

  res.end(`window.saashqSettings=${saashqSettings};${includeScripts}`);
};

export default widgetsMiddleware;
