import { PluginLayout } from '@saashq/ui/src/styles/main';
import React from 'react';
import GeneralRoutes from './generalRoutes';
import { AppProvider } from 'coreui/appContext';
import { dummyUser } from '@saashq/ui/src/constants/dummy-data';
import '@saashq/ui/src/styles/global-styles.ts';
import 'saashq-icon/css/saashq.min.css';
import '@saashq/ui/src/styles/style.min.css';
import '@nateradebaugh/react-datetime/css/react-datetime.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const App = () => {
  return (
    <PluginLayout>
      <AppProvider currentUser={dummyUser}>
        <GeneralRoutes />
      </AppProvider>
    </PluginLayout>
  );
};

export default App;
