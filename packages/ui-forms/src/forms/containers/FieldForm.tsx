import React from 'react';
import { IProductCategory } from '@saashq/ui-products/src/types';
import Spinner from '@saashq/ui/src/components/Spinner';
import ErrorMsg from '@saashq/ui/src/components/ErrorMsg';
import { IField } from '@saashq/ui/src/types';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { queries } from '../../../../plugin-inbox-ui/src/bookings/graphql';
import FieldForm from '../components/FieldForm';

type Props = {
  onSubmit: (field: IField) => void;
  onDelete: (field: IField) => void;
  onCancel: () => void;
  mode: 'create' | 'update';
  field: IField;
  fields: IField[];
  numberOfPages: number;
  googleMapApiKey?: string;
};

const FormContainer = (props: Props) => {
  const { data, loading, error } = useQuery(gql(queries.productCategories), {
    skip: props.field.type !== 'productCategory'
  });

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMsg>{error.message}</ErrorMsg>;
  }

  const productCategories: IProductCategory[] =
    (data && data.productCategories) || [];

  return <FieldForm {...props} productCategories={productCategories} />;
};

export default FormContainer;
