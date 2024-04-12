import Button from 'modules/common/components/Button';
import FormControl from 'modules/common/components/form/Control';
import Form from 'modules/common/components/form/Form';
import FormGroup from 'modules/common/components/form/Group';
import ControlLabel from 'modules/common/components/form/Label';
import { ModalFooter } from 'modules/common/styles/main';
import { IFormProps } from 'modules/common/types';
import React from 'react';

type Props = {
  onSuccess: (password: string, values: any[]) => void;
  closeModal: () => void;
  formProps: IFormProps;
};

class PasswordConfirmation extends React.Component<Props> {
  submit = (values) => {
    this.props.onSuccess(values.password, this.props.formProps.values);
    this.props.closeModal();
  };

  renderContent = (formProps) => {
    return (
      <>
        <FormGroup>
          <ControlLabel>Pro potvrzení zadejte své heslo</ControlLabel>
          <FormControl
            autoFocus={true}
            type="password"
            name="password"
            required={true}
            {...formProps}
          />
        </FormGroup>
        <ModalFooter>
          <Button
            btnStyle="simple"
            icon="times-circle"
            onClick={this.props.closeModal}
          >
            Zrušení
          </Button>
          <Button type="submit" btnStyle="success" icon="check-circle">
            Uložit
          </Button>
        </ModalFooter>
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} onSubmit={this.submit} />;
  }
}

export default PasswordConfirmation;
