import React from 'react';
import { mutations } from '../../graphql';
import { gql } from '@apollo/client';
import TemplateForm from '../../components/forms/TemplateForm';
import { IFormProps, IButtonMutateProps } from '@saashq/ui/src/types';
import ButtonMutate from '@saashq/ui/src/components/ButtonMutate';
import { queries } from '../../graphql';

type Props = {
  formProps: IFormProps;
  closeModal: () => void;
  id: string;
  name: string;
};

type FinalProps = {} & Props;

const TemplateFormContainer = (props: FinalProps) => {
  const renderButton = ({
    values,
    isSubmitted,
    callback,
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={mutations.automationsSaveAsTemplate}
        variables={values}
        callback={callback}
        refetchQueries={[
          {
            query: gql(queries.automations),
            variables: {
              status: 'template',
            },
          },
        ]}
        isSubmitted={isSubmitted}
        type="submit"
        icon="check-circle"
        successMessage={`Úspěšně jste uložili šablonu`}
      />
    );
  };

  const extendedProps = {
    ...props,
    renderButton,
  };

  return <TemplateForm {...extendedProps} />;
};

export default TemplateFormContainer;
