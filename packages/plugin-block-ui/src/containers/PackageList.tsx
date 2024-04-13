import * as compose from 'lodash.flowright';

import { Alert, confirm, withProps } from '@saashq/ui/src/utils';
import { PackagesQueryResponse, PackageRemoveMutationResponse } from '../types';
import { mutations, queries } from '../graphql';

import ButtonMutate from '@saashq/ui/src/components/ButtonMutate';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import React from 'react';
import Spinner from '@saashq/ui/src/components/Spinner';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import PackageList from '../components/PackageList';

type Props = {
  history: any;
  type: string;
};

type FinalProps = {
  packagesQuery: PackagesQueryResponse;
} & Props &
  PackageRemoveMutationResponse;

const ListContainer = (props: FinalProps) => {
  const { packagesQuery, packagesRemove } = props;

  if (packagesQuery.loading) {
    return <Spinner />;
  }

  const remove = (tag) => {
    confirm(`Jsi si jistá?`)
      .then(() => {
        packagesRemove({ variables: { _id: tag._id } })
          .then(() => {
            Alert.success('Úspěšně jste smazali balíček');
            packagesQuery.refetch();
          })
          .catch((e) => {
            Alert.error(e.message);
          });
      })
      .catch((e) => {
        Alert.error(e.message);
      });
  };

  const renderButton = ({
    values,
    isSubmitted,
    callback,
    object,
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={object ? mutations.packagesEdit : mutations.packagesAdd}
        variables={values}
        callback={callback}
        refetchQueries={getRefetchQueries()}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`Ty úspěšně ${
          object ? 'aktualizováno' : 'přidal'
        } balík`}
      />
    );
  };

  const updatedProps = {
    ...props,

    packages: packagesQuery.packages || [],
    loading: packagesQuery.loading,
    remove,
    renderButton,
  };

  return <PackageList {...updatedProps} />;
};

const getRefetchQueries = () => {
  return [
    {
      query: gql(queries.packages),
    },
  ];
};

export default withProps<Props>(
  compose(
    graphql<Props, PackagesQueryResponse>(gql(queries.packages), {
      name: 'packagesQuery',
    }),
    graphql<Props, PackageRemoveMutationResponse, { _id: string }>(
      gql(mutations.packagesRemove),
      {
        name: 'packagesRemove',
      },
    ),
  )(ListContainer),
);
