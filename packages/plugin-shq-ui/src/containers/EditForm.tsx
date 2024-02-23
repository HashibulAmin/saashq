import React from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';

import { Alert } from '@saashq/ui/src/utils';

import EditForm from '../components/EditForm';
import { mutations } from '../graphql';
import { IShq } from '../types';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import ButtonMutate from '@saashq/ui/src/components/ButtonMutate';

type Props = {
  shq: IShq;
};

function EditFormContainer(props: Props) {
  const [editMutation] = useMutation(gql(mutations.shqsEdit));

  const edit = (variables: IShq) => {
    editMutation({ variables })
      .then(() => {
        Alert.success('Successfully edited');
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  const renderButton = ({
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={mutations.shqsEdit}
        variables={values}
        callback={callback}
        refetchQueries={'shqGet'}
        isSubmitted={isSubmitted}
        type="submit"
        icon="check-circle"
        successMessage={`You successfully ${
          object ? 'updated' : 'added'
        } a shq`}
      />
    );
  };

  return <EditForm edit={edit} shq={props.shq} renderButton={renderButton} />;
}

export default EditFormContainer;
