import * as compose from 'lodash.flowright';

import { graphql, ChildProps } from '@apollo/client/react/hoc';
import { IButtonMutateProps, IFormProps } from '@saashq/ui/src/types';

import { BrandsQueryResponse } from '@saashq/ui/src/brands/types';
import ButtonMutate from '@saashq/ui/src/components/ButtonMutate';
import React from 'react';
import SelectBrand from '../components/SelectBrand';
import Spinner from '@saashq/ui/src/components/Spinner';
import { mutations as brandMutations } from '@saashq/ui/src/brands/graphql';
import { queries as brandQueries } from '@saashq/ui/src/brands/graphql';
import { gql } from '@apollo/client';

type Props = {
  onChange: () => void;
  defaultValue: string;
  creatable: boolean;
  isRequired?: boolean;
  formProps: IFormProps;
};

type FinalProps = {
  brandsQuery: BrandsQueryResponse;
} & Props;

const SelectBrandContainer = (props: ChildProps<FinalProps>) => {
  const { brandsQuery, formProps } = props;

  const brands = brandsQuery.brands || [];

  if (brandsQuery.loading) {
    return <Spinner objective={true} />;
  }

  const renderButton = ({
    name,
    values,
    isSubmitted,
    callback,
  }: IButtonMutateProps) => {
    const callBackResponse = () => {
      brandsQuery.refetch();

      if (callback) {
        callback();
      }
    };

    return (
      <ButtonMutate
        mutation={brandMutations.brandAdd}
        variables={values}
        callback={callBackResponse}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`Úspěšně jste přidali a ${name}`}
      />
    );
  };

  const updatedProps = {
    ...props,
    brands,
    formProps,
    renderButton,
  };

  return <SelectBrand {...updatedProps} />;
};

const getRefetchQueries = () => {
  return [
    {
      query: gql(brandQueries.brands),
      variables: {},
    },
  ];
};

export default compose(
  graphql<BrandsQueryResponse>(gql(brandQueries.brands), {
    name: 'brandsQuery',
    options: () => ({
      refetchQueries: getRefetchQueries,
    }),
  }),
)(SelectBrandContainer);
