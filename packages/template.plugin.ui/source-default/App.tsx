import React from 'react';
import GeneralRoutes from './generalRoutes';
import { PluginLayout } from '@saashq/ui/src/styles/main';
import '@saashq/ui/src/styles/global-styles';
import 'saashq-icon/css/saashq.min.css';
import '@saashq/ui/src/styles/style.min.css';

const App = () => {
  return (
    <PluginLayout>
      <GeneralRoutes />
    </PluginLayout>
  );
};

export default App;
