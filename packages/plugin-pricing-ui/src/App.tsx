import React from 'react';
import { PluginLayout } from '@saashq/ui/src/styles/main';
import GeneralRoutes from './generalRoutes';
import { AppProvider } from '@saashq/ui/src/appContext';
import { dummyUser } from '@saashq/ui/src/constants/dummy-data';

import '@saashq/ui/src/styles/global-styles.ts';
import 'saashq-icon/css/saashq.min.css';
import '@saashq/ui/src/styles/style.min.css';

const App = () => {
  return (
    <AppProvider currentUser={dummyUser}>
      <PluginLayout>
        <GeneralRoutes />
      </PluginLayout>
    </AppProvider>
  );
};

export default App;
