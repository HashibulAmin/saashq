import * as compose from 'lodash.flowright';

import {
  AddIntegrationMutationResponse,
  AddIntegrationMutationVariables,
} from '@saashq/ui-inbox/src/settings/integrations/types';
import { Alert, withProps } from '@saashq/ui/src/utils';
import { mutations, queries } from '@saashq/ui-leads/src/graphql';

import { AddFieldsMutationResponse } from '@saashq/ui-forms/src/settings/properties/types';
import { ConfigsQueryResponse } from '@saashq/ui-settings/src/general/types';
import { ILeadData } from '@saashq/ui-leads/src/types';
import { IRouterProps } from '@saashq/ui/src/types';
import Lead from '../components/Lead';
import React from 'react';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { isEnabled } from '@saashq/ui/src/utils/core';
import { queries as settingsQueries } from '@saashq/ui-settings/src/general/graphql';
import { withRouter } from 'react-router-dom';

type Props = {
  emailTemplatesQuery: any /*change type*/;
  emailTemplatesTotalCountQuery: any /*change type*/;
  configsQuery: ConfigsQueryResponse;
} & IRouterProps &
  AddIntegrationMutationResponse &
  AddFieldsMutationResponse;

type State = {
  isLoading: boolean;
  isReadyToSaveForm: boolean;
  isIntegrationSubmitted: boolean;
  integrationId?: string;
  mustWait?: any;
  doc?: {
    brandId: string;
    name: string;
    languageCode: string;
    lead: any;
    leadData: ILeadData;
    channelIds?: string[];
  };
};

class CreateLeadContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isLoading: false,
      isReadyToSaveForm: false,
      isIntegrationSubmitted: false,
      mustWait: { optionsStep: false },
    };
  }

  redirect = () => {
    let canClose = true;

    for (const key in this.state.mustWait) {
      if (this.state.mustWait[key]) {
        canClose = false;
      } else {
        canClose = true;
      }
    }

    if (canClose) {
      this.props.history.push({
        pathname: '/forms',
        search: `?popUpRefetchList=true&showInstallCode=${this.state.integrationId}`,
      });
    }
  };

  render() {
    const {
      addIntegrationMutation,
      history,
      emailTemplatesQuery,
      configsQuery,
    } = this.props;
    const afterFormDbSave = (id) => {
      this.setState({ isReadyToSaveForm: false });

      if (this.state.doc) {
        const { leadData, brandId, name, languageCode, channelIds } =
          this.state.doc;

        addIntegrationMutation({
          variables: {
            formId: id,
            leadData,
            brandId,
            name,
            languageCode,
            channelIds,
          },
        })
          .then(
            ({
              data: {
                integrationsCreateLeadIntegration: { _id },
              },
            }) => {
              this.setState({
                integrationId: _id,
                isIntegrationSubmitted: true,
              });
              Alert.success('Úspěšně jste přidali a form');

              this.redirect();
            },
          )

          .catch((error) => {
            Alert.error(error.message);

            this.setState({ isLoading: false });
          });
      }
    };

    const waitUntilFinish = (obj: any) => {
      const mustWait = { ...this.state.mustWait, ...obj };
      this.setState({ mustWait });
    };

    const save = (doc) => {
      this.setState({ isLoading: true, isReadyToSaveForm: true, doc });
    };

    const updatedProps = {
      ...this.props,
      fields: [],
      save,
      afterFormDbSave,
      waitUntilFinish,
      onChildProcessFinished: (component) => {
        if (this.state.mustWait.hasOwnProperty(component)) {
          const mustWait = { ...this.state.mustWait };
          mustWait[component] = false;
          this.setState({ mustWait });
        }

        this.redirect();
      },
      isActionLoading: this.state.isLoading,
      isReadyToSaveForm: this.state.isReadyToSaveForm,
      isIntegrationSubmitted: this.state.isIntegrationSubmitted,
      emailTemplates: emailTemplatesQuery
        ? emailTemplatesQuery.emailTemplates || []
        : [],
      configs: configsQuery.configs || [],
      integrationId: this.state.integrationId,
    };

    return <Lead {...updatedProps} currentMode="create" />;
  }
}

const withTemplatesQuery = withProps<Props>(
  compose(
    graphql<Props>(gql(queries.emailTemplates), {
      name: 'emailTemplatesQuery',
      options: ({ emailTemplatesTotalCountQuery }) => ({
        variables: {
          perPage: emailTemplatesTotalCountQuery.emailTemplatesTotalCount,
        },
      }),
      skip: !isEnabled('engages') ? true : false,
    }),
  )(CreateLeadContainer),
);

export default withProps<Props>(
  compose(
    graphql(gql(queries.templateTotalCount), {
      name: 'emailTemplatesTotalCountQuery',
      skip: !isEnabled('engages') ? true : false,
    }),
    graphql<{}, ConfigsQueryResponse>(gql(settingsQueries.configs), {
      name: 'configsQuery',
    }),
    graphql<
      {},
      AddIntegrationMutationResponse,
      AddIntegrationMutationVariables
    >(gql(mutations.integrationsCreateLeadIntegration), {
      name: 'addIntegrationMutation',
    }),
  )(withRouter<Props, any>(withTemplatesQuery)),
);
