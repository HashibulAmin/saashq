import { IButtonMutateProps, IFormProps } from '@saashq/ui/src/types';
import Button from '@saashq/ui/src/components/Button';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import Form from '@saashq/ui/src/components/form/Form';
import FormControl from '@saashq/ui/src/components/form/Control';
import FormGroup from '@saashq/ui/src/components/form/Group';
import { ModalFooter } from '@saashq/ui/src/styles/main';
import React from 'react';
import SelectBrand from '@saashq/ui-inbox/src/settings/integrations/containers/SelectBrand';
import SelectChannels from '@saashq/ui-inbox/src/settings/integrations/containers/SelectChannels';
import { __ } from '@saashq/ui/src/utils/core';
import OperatorForm from './OperatorForm';
import { Operator } from '../types';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  callback: () => void;
  onChannelChange: () => void;
  channelIds: string[];
};

type State = {
  operators: Operator[];
};

class IntegrationForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { operators: [] };
  }

  generateDoc = (values: any) => {
    return {
      name: values.name,
      brandId: values.brandId,
      kind: 'calls',
      data: {
        phone: values.phone,
        wsServer: values.wsServer,
        operators: this.state.operators,
      },
    };
  };

  renderField = ({
    label,
    fieldName,
    formProps,
  }: {
    label: string;
    fieldName: string;
    formProps: IFormProps;
  }) => {
    return (
      <FormGroup>
        <ControlLabel required={true}>{label}</ControlLabel>
        <FormControl
          {...formProps}
          name={fieldName}
          required={true}
          autoFocus={fieldName === 'name'}
        />
      </FormGroup>
    );
  };

  renderContent = (formProps: IFormProps) => {
    const { renderButton, callback, onChannelChange, channelIds } = this.props;
    const { values, isSubmitted } = formProps;
    const { operators } = this.state;

    const onChangeOperators = (index: number, value: any) => {
      operators[index] = value;
      this.setState({ operators });
    };

    const onChangeOperatorDetails = (
      name: string,
      value: string,
      index: number,
    ) => {
      const currentOperator = operators.find((l, i) => i === index);

      if (currentOperator) {
        currentOperator[name] = value;
      }
    };

    const handleAddOperation = () => {
      const temp = { userId: '', gsUsername: '', gsPassword: '' };
      const { operators } = this.state;

      operators.push(temp);

      this.setState({ operators });
    };

    const handleRemoveOperator = (index: number) => {
      const operators = this.state.operators.filter((l, i) => i !== index);

      this.setState({ operators });
    };

    return (
      <>
        {this.renderField({ label: 'Název', fieldName: 'name', formProps })}

        {this.renderField({
          label: 'Telefonní číslo',
          fieldName: 'phone',
          formProps,
        })}

        {this.renderField({
          label: 'Webový soketový server',
          fieldName: 'wsServer',
          formProps,
        })}

        <>
          {operators.map((operator, index) => (
            <OperatorForm
              operator={operator}
              index={index}
              formProps={formProps}
              onChange={onChangeOperators}
              onChangeDetails={onChangeOperatorDetails}
              removeOperator={handleRemoveOperator}
              key={index}
            />
          ))}
          <FormGroup>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                btnStyle="primary"
                icon="plus"
                size="medium"
                onClick={handleAddOperation}
              >
                {__('Přidat Operátora')}
              </Button>
            </div>
          </FormGroup>
        </>

        <SelectBrand
          isRequired={true}
          formProps={formProps}
          description={'Ke které konkrétní značce tato integrace patří?'}
        />

        <SelectChannels
          defaultValue={channelIds}
          isRequired={true}
          onChange={onChannelChange}
        />

        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            onClick={callback}
            icon="times-circle"
          >
            Cancel
          </Button>
          {renderButton({
            values: this.generateDoc(values),
            isSubmitted,
            callback,
          })}
        </ModalFooter>
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default IntegrationForm;
