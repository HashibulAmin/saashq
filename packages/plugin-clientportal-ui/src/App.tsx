import { PluginLayout } from '@saashq/ui/src/styles/main';
import { AppProvider } from 'coreui/appContext';
import React from 'react';

import GeneralRoutes from './generalRoutes';
import '@saashq/ui/src/styles/global-styles';
import '@saashq/ui/src/styles/style.min.css';
import 'saashq-icon/css/saashq.min.css';

const App = () => {
  return (
    <AppProvider>
      <PluginLayout>
        <GeneralRoutes />
      </PluginLayout>
    </AppProvider>
  );
};

export default App;
