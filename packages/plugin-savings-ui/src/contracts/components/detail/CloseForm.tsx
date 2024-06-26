import Button from '@saashq/ui/src/components/Button';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import DateControl from '@saashq/ui/src/components/form/DateControl';
import Form from '@saashq/ui/src/components/form/Form';
import FormControl from '@saashq/ui/src/components/form/Control';
import FormGroup from '@saashq/ui/src/components/form/Group';

import {
  MainStyleFormColumn as FormColumn,
  MainStyleFormWrapper as FormWrapper,
  MainStyleModalFooter as ModalFooter,
  MainStyleScrollWrapper as ScrollWrapper,
} from '@saashq/ui/src/styles/eindex';

import Info from '@saashq/ui/src/components/Info';
import { DateContainer } from '@saashq/ui/src/styles/main';
import { IButtonMutateProps, IFormProps } from '@saashq/ui/src/types';
import React from 'react';
import { ChangeAmount } from '../../styles';
import { ICloseInfo, IContract, IContractDoc } from '../../types';
import { __ } from 'coreui/utils';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  contract: IContract;
  closeInfo: ICloseInfo;
  onChangeDate: (date: Date) => void;
  closeModal: () => void;
  closeDate: Date;
};

type State = {
  closeType: string;
  description: string;
};

class CloseForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      closeType: '',
      description: '',
    };
  }

  generateDoc = (values: { _id: string } & IContractDoc) => {
    const { contract } = this.props;

    const finalValues = values;

    if (contract) {
      finalValues._id = contract._id;
    }

    return {
      contractId: finalValues._id,
      ...this.state,
      description: this.state.description,
      closeDate: this.props.closeDate,
      closeType: this.state.closeType,
    };
  };

  renderFormGroup = (label, props) => {
    return (
      <FormGroup>
        <ControlLabel required={!label.includes('Amount')}>
          {label}
        </ControlLabel>
        <FormControl {...props} />
      </FormGroup>
    );
  };

  onChangeField = (e) => {
    const name = (e.target as HTMLInputElement).name;
    const value = (e.target as HTMLInputElement).value;
    this.setState({ [name]: value } as any);
  };

  onFieldClick = (e) => {
    e.target.select();
  };

  renderRow = (label, fieldName) => {
    const { closeInfo } = this.props;
    const value = closeInfo[fieldName] || 0;
    return (
      <FormWrapper>
        <FormColumn>
          <ChangeAmount>
            <ControlLabel>{__(label)}</ControlLabel>
          </ChangeAmount>
        </FormColumn>
        <FormColumn>
          <ChangeAmount>{Number(value).toLocaleString()}</ChangeAmount>
        </FormColumn>
      </FormWrapper>
    );
  };
  renderCloseInfo = () => {
    return (
      <>
        {this.renderRow('Saving Amount', 'savingAmount')}
        {this.renderRow('Stored Interest', 'storedInterest')}
        {this.renderRow('Total', 'total')}
        {!!this.props.contract.loansOfForeclosed?.length && (
          <Info type="danger" title="Анхаар">
            This saving is collateraled on Loans
          </Info>
        )}
      </>
    );
  };

  renderContent = (formProps: IFormProps) => {
    const contract = this.props.contract || ({} as IContract);
    const { closeModal, renderButton, onChangeDate } = this.props;
    const { values, isSubmitted } = formProps;

    const onChangeCloseDate = (value) => {
      onChangeDate(value);
    };

    return (
      <>
        <ScrollWrapper>
          <FormWrapper>
            <FormColumn>
              <FormGroup>
                <ControlLabel required={true}>{__('Close Date')}</ControlLabel>
                <DateContainer>
                  <DateControl
                    {...formProps}
                    required={false}
                    dateFormat={'YYYY/MM/DD'}
                    name="closeDate"
                    value={this.props.closeDate}
                    onChange={onChangeCloseDate}
                  />
                </DateContainer>
              </FormGroup>
            </FormColumn>
          </FormWrapper>
          <FormWrapper>
            <FormColumn>
              <FormGroup>
                <ControlLabel>{__('Popis')}</ControlLabel>
                <FormControl
                  {...formProps}
                  max={140}
                  name="description"
                  componentClass="textarea"
                  value={this.state.description || ''}
                  onChange={this.onChangeField}
                />
              </FormGroup>
            </FormColumn>
          </FormWrapper>

          {this.renderCloseInfo()}
        </ScrollWrapper>

        <ModalFooter>
          <Button btnStyle="simple" onClick={closeModal} icon="cancel-1">
            {__('Close')}
          </Button>

          {renderButton({
            name: 'contract',
            values: this.generateDoc(values),
            isSubmitted,
            object: this.props.contract,
          })}
        </ModalFooter>
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default CloseForm;
