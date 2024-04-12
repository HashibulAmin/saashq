import Button from 'modules/common/components/Button';
import FormControl from 'modules/common/components/form/Control';
import FormGroup from 'modules/common/components/form/Group';
import ControlLabel from 'modules/common/components/form/Label';
import { ModalFooter } from 'modules/common/styles/main';
import { __ } from 'modules/common/utils';
import React from 'react';

type Props = {
  save: ({
    currentPassword,
    newPassword,
    confirmation,
  }: {
    currentPassword: string;
    newPassword: string;
    confirmation: string;
  }) => void;
  closeModal: () => void;
};

class ChangePassword extends React.Component<Props> {
  generateDoc = () => {
    return {
      currentPassword: (
        document.getElementById('current-password') as HTMLInputElement
      ).value,
      newPassword: (document.getElementById('new-password') as HTMLInputElement)
        .value,
      confirmation: (
        document.getElementById('new-password-confirmation') as HTMLInputElement
      ).value,
    };
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.save(this.generateDoc());
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup>
          <ControlLabel>Aktuální Heslo</ControlLabel>
          <FormControl
            type="password"
            placeholder={__('Aktuální heslo')}
            id="current-password"
          />
        </FormGroup>

        <br />

        <FormGroup>
          <ControlLabel>Nové Heslo</ControlLabel>
          <FormControl
            type="password"
            placeholder={__('Zadejte nové heslo')}
            id="new-password"
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Pro potvrzení zadejte heslo znovu</ControlLabel>
          <FormControl
            type="password"
            placeholder={__('Zadejte heslo znovu')}
            id="new-password-confirmation"
          />
        </FormGroup>
        <ModalFooter>
          <Button
            btnStyle="simple"
            onClick={this.props.closeModal}
            icon="times-circle"
          >
            Zavřít
          </Button>

          <Button btnStyle="success" type="submit" icon="check-circle">
            Uložit
          </Button>
        </ModalFooter>
      </form>
    );
  }
}

export default ChangePassword;
