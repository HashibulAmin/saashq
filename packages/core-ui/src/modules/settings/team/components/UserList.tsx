import {
  ICommonFormProps,
  ICommonListProps,
} from '@saashq/ui-settings/src/common/types';

import ActionButtons from '@saashq/ui/src/components/ActionButtons';
import { AppConsumer } from 'appContext';
import Button from '@saashq/ui/src/components/Button';
import { ControlLabel } from '@saashq/ui/src/components/form';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import { IUser } from '@saashq/ui/src/auth/types';
import Icon from '@saashq/ui/src/components/Icon';
import { Link } from 'react-router-dom';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import NameCard from '@saashq/ui/src/components/nameCard/NameCard';
import React from 'react';
import Table from '@saashq/ui/src/components/table';
import TextInfo from '@saashq/ui/src/components/TextInfo';
import Tip from '@saashq/ui/src/components/Tip';
import Toggle from '@saashq/ui/src/components/Toggle';
import { UserAvatar } from '../styles';
import UserForm from '@saashq/ui/src/team/containers/UserForm';
import UserResetPasswordForm from '@saashq/ui/src/team/containers/UserResetPasswordForm';
import { __, router } from 'modules/common/utils';

type IProps = {
  changeStatus: (id: string) => void;
  resendInvitation: (email: string) => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  queryParams?: any;
  history?: any;
};

type FinalProps = ICommonListProps &
  ICommonFormProps &
  IProps & { currentUser: IUser };

type States = {
  searchValue: string;
};

class UserList extends React.Component<FinalProps, States> {
  constructor(props: FinalProps) {
    super(props);

    const {
      queryParams: { searchValue },
    } = props;

    this.state = {
      searchValue: searchValue || '',
    };
  }

  onAvatarClick = (object) => {
    return this.props.history.push(`team/details/${object._id}`);
  };

  removeUserQueryParams = () => {
    const { queryParams, history } = this.props;
    if (queryParams && history && queryParams.positionIds) {
      router.removeParams(history, 'positionIds');
    }
  };

  renderForm = (props) => {
    const onCloseModal = () => {
      this.removeUserQueryParams();
      props.closeModal();
    };

    return (
      <UserForm
        {...props}
        closeModal={onCloseModal}
        history={this.props.history}
        queryParams={this.props.queryParams}
        renderButton={this.props.renderButton}
      />
    );
  };

  renderEditAction = (user: IUser) => {
    const { currentUser } = this.props;

    if (user._id === currentUser._id) {
      return (
        <Tip text={__('Prohlédnout profil')} placement="top">
          <Link to="/profile">
            <Icon icon="user-6" size={15} />
          </Link>
        </Tip>
      );
    }

    const editTrigger = (
      <Button btnStyle="link">
        <Tip text={__('Upravit')} placement="top">
          <Icon icon="pen-1" size={15} />
        </Tip>
      </Button>
    );

    const content = (props) => {
      return this.renderForm({ ...props, object: user });
    };

    const onModalExit = () => {
      this.removeUserQueryParams();
    };

    return (
      <ModalTrigger
        size="lg"
        title="Upravit"
        onExit={onModalExit}
        trigger={editTrigger}
        content={content}
      />
    );
  };

  renderResetPasswordForm = (props) => {
    return <UserResetPasswordForm {...props} />;
  };

  renderResetPassword = (user: IUser) => {
    const editTrigger = (
      <Button btnStyle="link">
        <Tip text={__('Obnovit heslo člena')} placement="top">
          <Icon icon="lock-alt" size={15} />
        </Tip>
      </Button>
    );

    const content = (props) => {
      return this.renderResetPasswordForm({ ...props, object: user });
    };

    return (
      <ModalTrigger
        title="Obnovit heslo člena"
        trigger={editTrigger}
        content={content}
      />
    );
  };

  renderResendInvitation(user: IUser) {
    const onClick = () => {
      this.props.resendInvitation(user.email);
    };

    if (user.status !== 'Not verified') {
      return null;
    }

    return (
      <Button btnStyle="link" onClick={onClick}>
        <Tip text={__('Přeposlat')} placement="top">
          <Icon icon="redo" size={15} />
        </Tip>
      </Button>
    );
  }

  renderRows({ objects }: { objects: IUser[] }) {
    return objects.map((object) => {
      const onClick = () => this.onAvatarClick(object);
      const onChange = () => this.props.changeStatus(object._id);

      return (
        <tr key={object._id}>
          <UserAvatar onClick={onClick}>
            <NameCard user={object} avatarSize={30} singleLine={true} />
          </UserAvatar>
          <td>
            <TextInfo
              textStyle={object.status === 'Verified' ? 'success' : 'warning'}
            >
              {object.status || 'Verified'}
            </TextInfo>
          </td>
          <td>{object.email}</td>
          <td>{object.employeeId || '-'}</td>
          <td>
            <Toggle
              defaultChecked={object.isActive}
              icons={{
                checked: <span>Yes</span>,
                unchecked: <span>No</span>,
              }}
              onChange={onChange}
            />
          </td>
          <td>
            <ActionButtons>
              {this.renderResendInvitation(object)}
              {this.renderEditAction(object)}
              {this.renderResetPassword(object)}
            </ActionButtons>
          </td>
        </tr>
      );
    });
  }

  renderContent = (props) => {
    return (
      <>
        <Table wideHeader={true}>
          <thead>
            <tr>
              <th>
                <ControlLabel>{__('Celé jméno')}</ControlLabel>
              </th>
              <th>
                <ControlLabel>{__('Stav pozvánky')}</ControlLabel>
              </th>
              <th>
                <ControlLabel>{__('E-mailem')}</ControlLabel>
              </th>
              <th>
                <ControlLabel>{__('ID Zaměstnance')}</ControlLabel>
              </th>
              <th>
                <ControlLabel>{__('Postavení')}</ControlLabel>
              </th>
              <th>
                <ControlLabel>{__('Akce')}</ControlLabel>
              </th>
            </tr>
          </thead>
          <tbody>{this.renderRows(props)}</tbody>
        </Table>
      </>
    );
  };

  render() {
    return this.renderContent(this.props);
  }
}

const WithConsumer = (props: IProps & ICommonListProps & ICommonFormProps) => {
  return (
    <AppConsumer>
      {({ currentUser }) => (
        <UserList {...props} currentUser={currentUser || ({} as IUser)} />
      )}
    </AppConsumer>
  );
};

export default WithConsumer;
