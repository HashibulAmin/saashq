import React from 'react';
import GeneralRoutes from './generalRoutes';
import { PluginLayout } from '@saashq/ui/src/styles/main';
import { AppProvider } from 'coreui/appContext';
import '@saashq/ui/src/styles/global-styles.ts';
import 'saashq-icon/css/saashq.min.css';
import '@saashq/ui/src/styles/style.min.css';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

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
