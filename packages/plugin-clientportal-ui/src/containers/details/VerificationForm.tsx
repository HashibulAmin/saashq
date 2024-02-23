import ButtonMutate from '@saashq/ui/src/components/ButtonMutate';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import React from 'react';

import VerificationForm from '../../components/detail/VerificationForm';
import { mutations } from '../../graphql';
import { IClientPortalUser } from '../../types';

type Props = {
  clientPortalUser: IClientPortalUser;
  closeModal?: () => void;
};

function FormContainer(props: Props) {
  const renderButton = ({
    name,
    values,
    isSubmitted,
    callback
  }: IButtonMutateProps) => {
    const callBackResponse = () => {
      if (callback) {
        callback();
      }
    };

    return (
      <ButtonMutate
        mutation={mutations.changeVerificationStatus}
        variables={values}
        callback={callBackResponse}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully updated a clientportal user.`}
        refetchQueries={['clientPortalUserDetail']}
      />
    );
  };

  return <VerificationForm {...props} renderButton={renderButton} />;
}

export default FormContainer;
