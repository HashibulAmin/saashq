import * as compose from 'lodash.flowright';
import From from '../components/Form';
import React from 'react';
import { ButtonMutate } from '@saashq/ui/src/components';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import { IReserveRem } from '../types';
import { mutations } from '../graphql';
import { withProps } from '@saashq/ui/src/utils';

type Props = {
  reserveRem?: IReserveRem;
  closeModal: () => void;
};

type FinalProps = {} & Props;

class ProductFormContainer extends React.Component<FinalProps> {
  render() {
    const {} = this.props;

    const renderButton = ({
      values,
      isSubmitted,
      callback,
      object
    }: IButtonMutateProps) => {
      return (
        <ButtonMutate
          mutation={mutations.reserveRemsAdd}
          variables={values}
          callback={callback}
          refetchQueries={getRefetchQueries()}
          isSubmitted={isSubmitted}
          type="submit"
          uppercase={false}
          successMessage={`You successfully created a day labels}`}
        />
      );
    };

    const updatedProps = {
      ...this.props,
      renderButton
    };

    return <From {...updatedProps} />;
  }
}

const getRefetchQueries = () => {
  return ['reserveRems', 'reserveRemsCount'];
};

export default withProps<Props>(compose()(ProductFormContainer));
