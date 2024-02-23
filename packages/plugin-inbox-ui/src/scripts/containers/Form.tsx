import * as compose from 'lodash.flowright';

import Form from '../components/Form';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import { ICommonFormProps } from '@saashq/ui-settings/src/common/types';
import { IntegrationsQueryResponse } from '@saashq/ui-inbox/src/settings/integrations/types';
import React from 'react';
import Spinner from '@saashq/ui/src/components/Spinner';
import { TopicsQueryResponse } from '@saashq/ui-knowledgebase/src/types';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { queries as integrationQueries } from '@saashq/ui-inbox/src/settings/integrations/graphql';
import { isEnabled } from '@saashq/ui/src/utils/core';
import { queries as kbQueries } from '@saashq/ui-knowledgebase/src/graphql';
import { withProps } from '@saashq/ui/src/utils';

type Props = {
  integrationsQuery: IntegrationsQueryResponse;
  kbTopicsQuery: TopicsQueryResponse;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

const FormContainer = (props: Props & ICommonFormProps) => {
  const { integrationsQuery, kbTopicsQuery } = props;

  if (integrationsQuery.loading || (kbTopicsQuery && kbTopicsQuery.loading)) {
    return <Spinner objective={true} />;
  }

  const integrations = integrationsQuery.integrations;

  const kbTopics = (kbTopicsQuery && kbTopicsQuery.knowledgeBaseTopics) || [];

  const updatedProps = {
    ...props,
    messengers: integrations.filter(i => i.kind === 'messenger'),
    leads: integrations.filter(i => i.kind === 'lead'),
    kbTopics
  };

  return <Form {...updatedProps} />;
};

export default withProps<ICommonFormProps>(
  compose(
    graphql(gql(integrationQueries.integrations), {
      name: 'integrationsQuery'
    }),
    graphql(gql(kbQueries.knowledgeBaseTopics), {
      name: 'kbTopicsQuery',
      skip: !isEnabled('knowledgebase')
    })
  )(FormContainer)
);
