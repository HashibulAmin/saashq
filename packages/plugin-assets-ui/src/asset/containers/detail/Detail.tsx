import { IUser } from '@saashq/ui/src/auth/types';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import Spinner from '@saashq/ui/src/components/Spinner';
import { withProps } from '@saashq/ui/src/utils';
import { gql } from '@apollo/client';
import * as compose from 'lodash.flowright';
import React from 'react';
import { graphql } from '@apollo/client/react/hoc';
import { IAsset, IAssetDetailQueryResponse } from '../../../common/types';
import { queries } from '../../graphql';
import AssetDetails from '../../components/detail/Detail';

type Props = {
  id: string;
  history: any;
};

type FinalProps = {
  assetDetailQuery: IAssetDetailQueryResponse;
  currentUser: IUser;
} & Props;

const AssetDetailContainer = (props: FinalProps) => {
  const { assetDetailQuery, currentUser } = props;

  if (assetDetailQuery.loading) {
    return <Spinner objective={true} />;
  }

  if (!assetDetailQuery.assetDetail) {
    return <EmptyState text="Dílo nenalezeno" image="/images/actions/24.svg" />;
  }

  const assetDetail = assetDetailQuery.assetDetail || ({} as IAsset);

  const refetchDetail = () => {
    props.assetDetailQuery.refetch();
  };

  const updatedProps = {
    ...props,
    loading: assetDetailQuery.loading,
    asset: assetDetail,
    refetchDetail,
    currentUser,
  };

  return <AssetDetails {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, IAssetDetailQueryResponse, { _id: string }>(
      gql(queries.assetDetail),
      {
        name: 'assetDetailQuery',
        options: ({ id }) => ({
          variables: {
            _id: id,
          },
        }),
      },
    ),
  )(AssetDetailContainer),
);
