import React from 'react';
import { IEmailTemplate } from '../types';
import { ICommonFormProps } from '@saashq/ui-settings/src/common/types';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import { mutations, queries } from '../graphql';
import { ButtonMutate } from '@saashq/ui/src/';
import FormComponent from '../components/Form';
import { gql } from '@apollo/client';

type Props = {
  object?: IEmailTemplate;
  params?: any;
  contentType?: string;
} & ICommonFormProps;

class Form extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const renderButton = ({
      name,
      values,
      isSubmitted,
      callback,
      confirmationUpdate,
      object,
    }: IButtonMutateProps) => {
      const afterMutate = () => {
        if (callback) {
          callback();
        }
      };

      let mutation = mutations.emailTemplatesAdd;
      let successAction = 'přidal';

      if (object) {
        mutation = mutations.emailTemplatesEdit;
        successAction = 'aktualizováno';
      }

      return (
        <ButtonMutate
          mutation={mutation}
          variables={values}
          callback={afterMutate}
          isSubmitted={isSubmitted}
          refetchQueries={[
            {
              query: gql(queries.emailTemplates),
              variables: { ...this.props.params },
            },
            {
              query: gql(queries.totalCount),
              variables: { ...this.props.params },
            },
          ]}
          type="submit"
          confirmationUpdate={confirmationUpdate}
          successMessage={`Ty úspěšně ${successAction} A ${name}`}
        />
      );
    };

    const updatedProps = {
      ...this.props,
      renderButton,
    };

    return <FormComponent {...updatedProps} />;
  }
}

export default Form;
