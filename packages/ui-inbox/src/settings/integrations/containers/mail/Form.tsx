import * as React from 'react';

import { IButtonMutateProps, IRouterProps } from '@saashq/ui/src/types';

import ButtonMutate from '@saashq/ui/src/components/ButtonMutate';
import Form from '../../components/mail/Form';
import { IntegrationTypes } from '../../types';
import { __ } from 'coreui/utils';
import { getRefetchQueries } from '../utils';
import { mutations } from '../../graphql';
import { withRouter } from 'react-router-dom';

type Props = {
  type?: string;
  kind: IntegrationTypes;
  closeModal: () => void;
};

type FinalProps = {} & IRouterProps & Props;

type State = {
  accountId: string;
};

class FormContainer extends React.Component<FinalProps, State> {
  constructor(props: FinalProps) {
    super(props);

    this.state = { accountId: '' };
  }

  onAccountSelect = (accountId?: string) => {
    if (!accountId) {
      return this.setState({ accountId: '' });
    }

    this.setState({ accountId });
  };

  onRemoveAccount = () => {
    this.setState({ accountId: '' });
  };

  renderButton = ({
    name,
    values,
    isSubmitted,
    callback,
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={mutations.integrationsCreateExternalIntegration}
        variables={values}
        callback={callback}
        refetchQueries={getRefetchQueries(this.props.kind)}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={__(`Úspěšně jste přidali a`) + `${name}`}
      />
    );
  };

  render() {
    const { kind, closeModal } = this.props;
    const { accountId } = this.state;

    const updatedProps = {
      kind,
      closeModal,
      accountId,
      onAccountSelect: this.onAccountSelect,
      onRemoveAccount: this.onRemoveAccount,
      renderButton: this.renderButton,
    };

    return <Form {...updatedProps} />;
  }
}

export default withRouter<FinalProps>(FormContainer);
