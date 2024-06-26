import { ButtonMutate, withCurrentUser, withProps } from '@saashq/ui/src';
import { IUser, UsersQueryResponse } from '@saashq/ui/src/auth/types';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import * as compose from 'lodash.flowright';
import React from 'react';

import ContractTypeForm from '../components/ContractTypeForm';
import { mutations } from '../graphql';
import { IContractType } from '../types';
import { __ } from 'coreui/utils';
type Props = {
  contractType: IContractType;
  getAssociatedContractType?: (contractTypeId: string) => void;
  closeModal: () => void;
};

type FinalProps = {
  usersQuery: UsersQueryResponse;
  currentUser: IUser;
} & Props;

class ContractTypeFromContainer extends React.Component<FinalProps> {
  render() {
    const renderButton = ({
      name,
      values,
      isSubmitted,
      object,
    }: IButtonMutateProps) => {
      const { closeModal, getAssociatedContractType } = this.props;

      const afterSave = (data) => {
        closeModal();

        if (getAssociatedContractType) {
          getAssociatedContractType(data.savingsContractTypesAdd);
        }
      };

      return (
        <ButtonMutate
          mutation={
            object ? mutations.contractTypesEdit : mutations.contractTypesAdd
          }
          variables={values}
          callback={afterSave}
          refetchQueries={getRefetchQueries()}
          isSubmitted={isSubmitted}
          type="submit"
          successMessage={`You successfully ${
            object ? 'updated' : 'added'
          } a ${name}`}
        >
          {__('Uložit')}
        </ButtonMutate>
      );
    };

    const updatedProps = {
      ...this.props,
      renderButton,
    };
    return <ContractTypeForm {...updatedProps} />;
  }
}

const getRefetchQueries = () => {
  return [
    'contractTypesMain',
    'SavingsContractTypesMain',
    'savingsContractTypes',
  ];
};

export default withCurrentUser(
  withProps<Props>(compose()(ContractTypeFromContainer)),
);
