import ButtonMutate from '@saashq/ui/src/components/ButtonMutate';
import { gql } from '@apollo/client';
import { IButtonMutateProps, IRouterProps } from '@saashq/ui/src/types';
import Form from '../components/Form';
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { mutations, queries } from '@saashq/ui-inbox/src/settings/integrations/graphql';

type Props = {} & IRouterProps;

class {Name}Container extends React.Component<Props> {
  renderButton = ({ values, isSubmitted }: IButtonMutateProps) => {
    const { history } = this.props;

    const callback = () => {
      history.push('/settings/integrations');
    };

    return (
      <ButtonMutate
        mutation={mutations.integrationsCreateExternalIntegration}
        variables={values}
        callback={callback}
        isSubmitted={isSubmitted}
        refetchQueries={getRefetchQueries('{name}')}
        type="submit"
        successMessage={`Úspěšně jste přidali a {name}`}
      />
    );
  };

  render() {
    const updatedProps = {
      ...this.props,
      renderButton: this.renderButton
    };

    return <Form {...updatedProps} />;
  }
}

const getRefetchQueries = (kind: string) => {
  return [
    {
      query: gql(queries.integrations),
      variables: {
        kind
      }
    },
    {
      query: gql(queries.integrationTotalCount),
      variables: {
        kind
      }
    }
  ];
};

export default withRouter<Props>({Name}Container);
