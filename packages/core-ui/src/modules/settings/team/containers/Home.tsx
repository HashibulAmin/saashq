import { mutations, queries } from '@saashq/ui/src/team/graphql';

import ButtonMutate from '@saashq/ui/src/components/ButtonMutate';
import Home from '../components/Home';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import React from 'react';
import { queries as generalQueries } from '@saashq/ui-settings/src/general/graphql';
import { gql } from '@apollo/client';
import { options } from './UserList';
import { queries as permissionQueries } from '@saashq/ui-settings/src/permissions/graphql';
import { useQuery } from '@apollo/client';

type Props = {
  queryParams: any;
  history: any;
};

function HomeContainer(props: Props) {
  const usersGroupQuery = useQuery(gql(permissionQueries.usersGroups), {
    fetchPolicy: 'network-only',
  });
  const configsEnvQuery = useQuery(gql(generalQueries.configsGetEnv));
  const totalCountQuery = useQuery(
    gql(queries.usersTotalCount),
    options({ queryParams: props.queryParams || {} }),
  );

  const getRefetchQueries = () => {
    return ['users', 'usersTotalCount'];
  };

  const renderButton = ({
    name,
    values,
    isSubmitted,
    callback,
    object,
    beforeSubmit,
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={mutations.usersInvite}
        variables={values}
        callback={callback}
        refetchQueries={getRefetchQueries()}
        isSubmitted={isSubmitted}
        type="submit"
        beforeSubmit={beforeSubmit}
        successMessage={`Ty úspěšně ${
          object ? 'aktualizováno' : 'přidal'
        } A ${name}`}
      />
    );
  };

  const usersGroups = usersGroupQuery.loading
    ? []
    : usersGroupQuery.data.usersGroups || [];

  const totalCount = totalCountQuery.loading
    ? 0
    : totalCountQuery.data?.usersTotalCount || 0;

  return (
    <Home
      configsEnvQuery={configsEnvQuery}
      usersGroups={usersGroups}
      renderButton={renderButton}
      loading={usersGroupQuery.loading}
      totalCount={totalCount}
      {...props}
    />
  );
}

export default HomeContainer;
