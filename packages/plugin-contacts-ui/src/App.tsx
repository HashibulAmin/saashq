import React from 'react';
import GeneralRoutes from './generalRoutes';
import { PluginLayout } from '@saashq/ui/src/styles/main';
import { AppProvider } from 'coreui/appContext';
import { ApolloProvider } from '@apollo/client';
import '@saashq/ui/src/styles/global-styles';
import 'saashq-icon/css/saashq.min.css';
import '@saashq/ui/src/styles/style.min.css';
import apolloClient from '@saashq/ui/src/apolloClient';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);

const App = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <AppProvider>
        <PluginLayout>
          <GeneralRoutes />
        </PluginLayout>
      </AppProvider>
    </ApolloProvider>
  );
};

export default App;
