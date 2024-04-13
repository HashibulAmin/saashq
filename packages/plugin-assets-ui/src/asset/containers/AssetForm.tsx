import React from 'react';
import {
  IAsset,
  IAssetCategoryQeuryResponse,
  IAssetQueryResponse,
} from '../../common/types';
import { ButtonMutate } from '@saashq/ui/src';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import { getRefetchQueries } from '../../common/utils';
import { withProps } from '@saashq/ui/src/utils/core';
import { gql } from '@apollo/client';
import * as compose from 'lodash.flowright';
import { graphql } from '@apollo/client/react/hoc';
import AssetForm from '../components/AssetForm';
import { queries, mutations } from '../graphql';

type Props = {
  asset: IAsset;
  queryParams: any;
  closeModal: () => void;
};

type FinalProps = {
  assetCategories: IAssetCategoryQeuryResponse;
  assets: IAssetQueryResponse;
} & Props;

function AssetFormContainer(props: FinalProps) {
  const { assetCategories, assets } = props;

  const renderButton = ({
    text,
    values,
    isSubmitted,
    callback,
    object,
  }: IButtonMutateProps) => {
    const { unitPrice, assetCount, minimiumCount } = values;
    const attachmentMoreArray: any[] = [];
    const attachment = values.attachment || undefined;
    const attachmentMore = values.attachmentMore || [];

    attachmentMore.map((attach) => {
      attachmentMoreArray.push({ ...attach, __typename: undefined });
    });

    values.unitPrice = Number(unitPrice);
    values.assetCount = Number(assetCount);
    values.minimiumCount = Number(minimiumCount);
    values.attachment = attachment
      ? { ...attachment, __typename: undefined }
      : null;
    values.attachmentMore = attachmentMoreArray;

    return (
      <ButtonMutate
        mutation={object ? mutations.assetEdit : mutations.assetAdd}
        variables={values}
        callback={callback}
        refetchQueries={getRefetchQueries()}
        isSubmitted={isSubmitted}
        type="submit"
        uppercase={false}
        successMessage={`Ty úspěšně ${
          object ? 'aktualizováno' : 'přidal'
        } A ${text}`}
      />
    );
  };

  const updatedProps = {
    ...props,
    categories: assetCategories.assetCategories,
    assets: assets.assets,
    renderButton,
    loading: assetCategories.loading || assets.loading,
  };

  return <AssetForm {...updatedProps} />;
}

export default withProps<Props>(
  compose(
    graphql(gql(queries.assetCategory), {
      name: 'assetCategories',
    }),
    graphql(gql(queries.assets), {
      name: 'assets',
    }),
  )(AssetFormContainer),
);
