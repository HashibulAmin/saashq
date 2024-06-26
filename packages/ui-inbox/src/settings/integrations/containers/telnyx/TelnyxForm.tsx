import { IButtonMutateProps, IRouterProps } from '@saashq/ui/src/types';

import ButtonMutate from '@saashq/ui/src/components/ButtonMutate';
import { INTEGRATION_KINDS } from '@saashq/ui/src/constants/integrations';
import React from 'react';
import TelnyxForm from '../../components/telnyx/TelnyxForm';
import { getRefetchQueries } from '../utils';
import { mutations } from '../../graphql';
import { withRouter } from 'react-router-dom';

type Props = {
  type?: string;
  closeModal: () => void;
};

type FinalProps = {} & IRouterProps & Props;

class TelnyxContainer extends React.Component<FinalProps> {
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
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`Úspěšně jste přidali a ${name}`}
        refetchQueries={getRefetchQueries(INTEGRATION_KINDS.TELNYX)}
      />
    );
  };

  render() {
    const { closeModal } = this.props;
    const updatedProps = {
      closeModal,
      renderButton: this.renderButton,
    };

    return <TelnyxForm {...updatedProps} />;
  }
}

export default withRouter<FinalProps>(TelnyxContainer);
