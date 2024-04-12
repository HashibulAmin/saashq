import * as compose from 'lodash.flowright';

import { Alert, confirm } from 'modules/common/utils';
import {
  IUserGroup,
  UsersGroupsQueryResponse,
} from '@saashq/ui-settings/src/permissions/types';
import {
  PermissionActionsQueryResponse,
  PermissionModulesQueryResponse,
  PermissionRemoveMutationResponse,
  PermissionTotalCountQueryResponse,
  PermissionsFixMutationResponse,
  PermissionsQueryResponse,
} from '../types';
import { mutations, queries } from '../graphql';

import PermissionList from '../components/PermissionList';
import React from 'react';
import { generatePaginationParams } from 'modules/common/utils/router';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';

type FinalProps = {
  can: (action: string) => boolean;
} & Props;

const List = (props: FinalProps) => {
  const {
    fixPermissionsMutation,
    history,
    queryParams,
    permissionsQuery,
    modulesQuery,
    actionsQuery,
    usersGroupsQuery,
    totalCountQuery,
    removeMutation,
  } = props;

  // remove action
  const remove = (id: string) => {
    confirm('Toto bude trvale smazáno, jste si naprosto jisti?', {
      hasDeleteConfirm: true,
    }).then(() => {
      removeMutation({
        variables: { ids: [id] },
      })
        .then(() => {
          Alert.success('Úspěšně jste smazali oprávnění.');
        })
        .catch((error) => {
          Alert.error(error.message);
        });
    });
  };

  const isLoading =
    permissionsQuery.loading ||
    modulesQuery.loading ||
    actionsQuery.loading ||
    usersGroupsQuery.loading ||
    totalCountQuery.loading;

  const groups = usersGroupsQuery.usersGroups || [];
  const currentGroup =
    groups.find((group) => queryParams.groupId === group._id) ||
    ({} as IUserGroup);

  const updatedProps = {
    ...props,
    queryParams,
    history,
    remove,
    totalCount: totalCountQuery.permissionsTotalCount || 0,
    modules: modulesQuery.permissionModules || [],
    actions: actionsQuery.permissionActions || [],
    permissions: permissionsQuery.permissions || [],
    groups,
    isLoading,
    currentGroupName: currentGroup.name,
    refetchQueries: commonOptions(queryParams),
    fixPermissions: fixPermissionsMutation,
  };

  return <PermissionList {...updatedProps} />;
};

type Props = {
  history: any;
  queryParams: any;
  permissionsQuery: PermissionsQueryResponse;
  modulesQuery: PermissionModulesQueryResponse;
  actionsQuery: PermissionActionsQueryResponse;
  usersGroupsQuery: UsersGroupsQueryResponse;
  totalCountQuery: PermissionTotalCountQueryResponse;
  removeMutation: (params: { variables: { ids: string[] } }) => Promise<any>;
  fixPermissionsMutation: PermissionsFixMutationResponse;
};

const commonOptions = (queryParams) => {
  const variables = {
    module: queryParams.module,
    action: queryParams.action,
    userId: queryParams.userId,
    groupId: queryParams.groupId,
    allowed: queryParams.allowed === 'notAllowed' ? false : true,
    ...generatePaginationParams(queryParams),
  };

  return [
    { query: gql(queries.permissions), variables },
    { query: gql(queries.totalCount), variables },
  ];
};

export default compose(
  graphql<Props, PermissionTotalCountQueryResponse>(gql(queries.totalCount), {
    name: 'totalCountQuery',
    options: ({ queryParams }) => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        module: queryParams.module,
        action: queryParams.action,
        userId: queryParams.userId,
        groupId: queryParams.groupId,
        allowed: queryParams.allowed === 'notAllowed' ? false : true,
      },
    }),
  }),
  graphql<Props, PermissionsQueryResponse>(gql(queries.permissions), {
    name: 'permissionsQuery',
    options: ({ queryParams }) => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        module: queryParams.module,
        action: queryParams.action,
        userId: queryParams.userId,
        groupId: queryParams.groupId,
        allowed: queryParams.allowed === 'notAllowed' ? false : true,
        ...generatePaginationParams(queryParams),
      },
    }),
  }),
  graphql<Props, PermissionModulesQueryResponse>(gql(queries.modules), {
    name: 'modulesQuery',
  }),
  graphql<Props, PermissionActionsQueryResponse>(gql(queries.actions), {
    name: 'actionsQuery',
  }),
  graphql<{}, UsersGroupsQueryResponse>(gql(queries.usersGroups), {
    name: 'usersGroupsQuery',
  }),

  // mutations
  graphql<Props, PermissionRemoveMutationResponse>(
    gql(mutations.permissionRemove),
    {
      name: 'removeMutation',
      options: ({ queryParams }) => ({
        refetchQueries: commonOptions(queryParams),
      }),
    },
  ),
  graphql<Props>(gql(mutations.permissionsFix), {
    name: 'fixPermissionsMutation',
    options: ({ queryParams }) => ({
      refetchQueries: commonOptions(queryParams),
    }),
  }),
)(List);
