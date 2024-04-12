import React from 'react';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import ButtonMutate from '@saashq/ui/src/components/ButtonMutate';
import { mutations } from '@saashq/ui/src/team/graphql';
import Form from '../../components/structure/Form';
import { IStructure } from '@saashq/ui/src/team/types';

type Props = {
  showView: () => void;
  refetch: () => Promise<any>;
  structure?: IStructure;
};

export default function FormContainer({ refetch, showView, structure }: Props) {
  const renderButton = ({
    name,
    values,
    isSubmitted,
    object,
    callback,
  }: IButtonMutateProps) => {
    const callbackResponse = () => {
      refetch().then(() => {
        showView();
      });

      if (callback) {
        callback();
      }
    };

    return (
      <ButtonMutate
        mutation={
          object._id ? mutations.structuresEdit : mutations.structuresAdd
        }
        variables={values}
        isSubmitted={isSubmitted}
        type="submit"
        callback={callbackResponse}
        successMessage={`Ty úspěšně ${
          object._id ? 'aktualizováno' : 'přidal'
        } A ${name}`}
      />
    );
  };

  return (
    <Form
      structure={structure}
      showView={showView}
      renderButton={renderButton}
    />
  );
}
