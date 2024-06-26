import { ButtonMutate } from '@saashq/ui/src';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import { withProps } from '@saashq/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import React from 'react';
import { IAssetCategoryTypes } from '../../common/types';
import { mutations } from '../graphql';

import CategoryForm from '../components/CategoryForm';

type Props = {
  closeModal: () => void;
  category: IAssetCategoryTypes;
  categories: IAssetCategoryTypes[];
};

function CategoryFormContainer({ closeModal, category, categories }: Props) {
  const renderButton = ({
    text,
    values,
    isSubmitted,
    callback,
    confirmationUpdate,
    object,
  }: IButtonMutateProps) => {
    let mutation = mutations.assetCategoryAdd;

    let sucessAction = 'přidal';

    if (object) {
      mutation = mutations.assetCategoryEdit;
      sucessAction = 'aktualizováno';
    }

    return (
      <ButtonMutate
        mutation={mutation}
        variables={values}
        callback={callback}
        refetchQueries={['assetCategories', 'assetCategoriesTotalCount']}
        isSubmitted={isSubmitted}
        type="submit"
        confirmationUpdate={confirmationUpdate}
        successMessage={`Ty úspěšně ${sucessAction} A ${text}`}
      />
    );
  };

  const updatedProps = {
    renderButton,
    closeModal,
    category,
    categories,
  };

  return <CategoryForm {...updatedProps} />;
}

export default withProps<Props>(compose()(CategoryFormContainer));
