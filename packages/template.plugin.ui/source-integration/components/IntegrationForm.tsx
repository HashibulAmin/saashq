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
import Accounts from '../containers/Accounts';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  callback: () => void;
  onChannelChange: () => void;
  channelIds: string[];
};

type State = {
  accountId: string;
};
class IntegrationForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      accountId: ""
    }
  }

  onSelectAccount = (accountId: string) => {
    this.setState({ accountId });
  }

  generateDoc = (values: {
    name: string;
    brandId: string;
  }) => {
    return {
      name: values.name,
      brandId: values.brandId,
      kind: '{name}',
      accountId: this.state.accountId
    };
  };

  renderField = ({
    label,
    fieldName,
    formProps
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

    return (
      <>

        {this.renderField({ label: 'Název', fieldName: 'name', formProps })}

        <SelectBrand
          isRequired={true}
          formProps={formProps}
          description={(
            'Which specific Brand does this integration belong to?'
          )}
        />

        <SelectChannels
          defaultValue={channelIds}
          isRequired={true}
          onChange={onChannelChange}
        />

        <Accounts
          onSelectAccount={this.onSelectAccount}
          accountId={this.state.accountId}
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
            callback
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
