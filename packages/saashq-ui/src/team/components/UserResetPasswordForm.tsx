import { IUser } from '@saashq/ui/src/auth/types';
import Button from '@saashq/ui/src/components/Button';
import FormControl from '@saashq/ui/src/components/form/Control';
import FormGroup from '@saashq/ui/src/components/form/Group';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import { ModalFooter } from '@saashq/ui/src/styles/main';
import { __ } from '@saashq/ui/src/utils';
import React from 'react';

type Props = {
  object: IUser;
  save: ({
    _id,
    newPassword,
    repeatPassword,
  }: {
    _id: string;
    newPassword: string;
    repeatPassword: string;
  }) => void;
  closeModal: () => void;
};

class UserResetPasswordForm extends React.Component<Props> {
  generateDoc = () => {
    return {
      _id: this.props.object._id,
      newPassword: (document.getElementById('new-password') as HTMLInputElement)
        .value,
      repeatPassword: (
        document.getElementById('repeat-password') as HTMLInputElement
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
          <ControlLabel>Nové Heslo</ControlLabel>

          <FormControl
            type="password"
            placeholder={__('Zadejte nové heslo')}
            id="new-password"
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Zopakovat heslo</ControlLabel>

          <FormControl
            type="password"
            placeholder={__('zopakovat heslo')}
            id="repeat-password"
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

export default UserResetPasswordForm;
