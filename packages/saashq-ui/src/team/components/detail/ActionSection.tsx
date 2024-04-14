import { IUser, IUserDetails } from '@saashq/ui/src/auth/types';
import { __, loadDynamicComponent } from '@saashq/ui/src/utils';

import { Actions } from '@saashq/ui/src/styles/main';
import Button from '@saashq/ui/src/components/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownToggle from '@saashq/ui/src/components/DropdownToggle';
import Icon from '@saashq/ui/src/components/Icon';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import React from 'react';
import Tip from '@saashq/ui/src/components/Tip';
import UserResetPasswordForm from '../../containers/UserResetPasswordForm';

type Props = {
  user: IUser;
  isSmall?: boolean;
  resendInvitation: (email: string) => void;
  changeStatus: (id: string) => void;
  renderEditForm: ({
    closeModal,
    user,
  }: {
    closeModal: () => void;
    user: IUser;
  }) => React.ReactNode;
};

class ActionSection extends React.Component<Props> {
  renderActions() {
    const { user } = this.props;
    const { operatorPhone } = user.details || ({} as IUserDetails);

    return (
      <>
        {loadDynamicComponent('actionForms', { user }, true)}
        <Button
          href={operatorPhone && `tel:${operatorPhone}`}
          size="small"
          btnStyle={operatorPhone ? 'primary' : 'simple'}
          disabled={operatorPhone ? false : true}
        >
          <Tip text="Volání" placement="top-end">
            <Icon icon="phone" />
          </Tip>
        </Button>
      </>
    );
  }

  renderButton() {
    const { isSmall } = this.props;

    return (
      <Button size="small" btnStyle="default">
        {isSmall ? (
          <Icon icon="ellipsis-h" />
        ) : (
          <>
            {__('Akce')} <Icon icon="angle-down" />
          </>
        )}
      </Button>
    );
  }

  renderEditButton() {
    const { user, renderEditForm } = this.props;

    const userForm = (props) => {
      return renderEditForm({ ...props, user });
    };

    return (
      <li>
        <ModalTrigger
          title="Upravit základní informace"
          trigger={<a href="#edit">{__('Upravit Profil')}</a>}
          size="lg"
          content={userForm}
        />
      </li>
    );
  }

  renderResendInvitation = () => {
    const { user, resendInvitation } = this.props;

    const onClick = () => {
      resendInvitation(user.email);
    };

    if (user.status !== 'Not verified') {
      return null;
    }

    return (
      <li>
        <a href="#resend" onClick={onClick}>
          {__('Znovu poslat pozvánku')}
        </a>
      </li>
    );
  };

  renderDeActivate = () => {
    const { user, changeStatus } = this.props;

    const onClick = () => {
      changeStatus(user._id);
    };

    return (
      <li>
        <a href="#deactivate" onClick={onClick}>
          {user.isActive ? __('Deaktivovat') : __('Aktivovat')}
        </a>
      </li>
    );
  };

  renderResetPassword = () => {
    const content = (props) => {
      return <UserResetPasswordForm {...props} object={this.props.user} />;
    };

    return (
      <ModalTrigger
        title="Obnovit heslo člena"
        trigger={
          <li>
            <a href="#reset">{__('Obnovit Heslo')}</a>
          </li>
        }
        content={content}
      />
    );
  };

  renderDropdown() {
    return (
      <Dropdown>
        <Dropdown.Toggle as={DropdownToggle} id="dropdown-action">
          {this.renderButton()}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {this.renderEditButton()}
          {this.renderResendInvitation()}
          {this.renderResetPassword()}
          {this.renderDeActivate()}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  render() {
    return (
      <Actions>
        {this.renderActions()}
        {this.renderDropdown()}
      </Actions>
    );
  }
}

export default ActionSection;
