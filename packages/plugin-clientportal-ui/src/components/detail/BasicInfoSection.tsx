import DropdownToggle from '@saashq/ui/src/components/DropdownToggle';
import { confirm } from '@saashq/ui/src/utils';
import Alert from '@saashq/ui/src/utils/Alert';
import Button from '@saashq/ui/src/components/Button';
import { ModalTrigger } from '@saashq/ui/src/components';
import Icon from '@saashq/ui/src/components/Icon';
import Tip from '@saashq/ui/src/components/Tip';
import { Actions } from '@saashq/ui/src/styles/main';
import ClientPortalUserForm from '../../containers/ClientPortalUserForm';
import Dropdown from 'react-bootstrap/Dropdown';
import { IClientPortalUser } from '../../types';
import React from 'react';
import SmsForm from '@saashq/ui-inbox/src/settings/integrations/containers/telnyx/SmsForm';
import { loadDynamicComponent, __ } from '@saashq/ui/src/utils';
// import ExtendSubscription from '@saashq/ui-forum/src/containers/ExtendSubscriptionForm';
import EmailWidget from '@saashq/ui-inbox/src/inbox/components/EmailWidget';
import { isEnabled } from '@saashq/ui/src/utils/core';

type Props = {
  clientPortalUser: IClientPortalUser;
  remove: () => void;
  isSmall?: boolean;
};

class BasicInfoSection extends React.Component<Props> {
  renderActions() {
    const { clientPortalUser } = this.props;
    const { phone, email } = clientPortalUser;

    const smsForm = (props) => <SmsForm {...props} phone={phone} />;

    return (
      <>
        {(isEnabled('engages') || isEnabled('imap')) && (
          <EmailWidget
            disabled={email ? false : true}
            buttonStyle={email ? 'primary' : 'simple'}
            emailTo={email}
            customerId={clientPortalUser._id || undefined}
            buttonSize="small"
            type="action"
          />
        )}
        <ModalTrigger
          dialogClassName="middle"
          title={`Poslat SMS na (${phone})`}
          trigger={
            <Button
              disabled={phone ? false : true}
              size="small"
              btnStyle={phone ? 'primary' : 'simple'}
            >
              <Tip text="Pošli SMS" placement="top-end">
                <Icon icon="message" />
              </Tip>
            </Button>
          }
          content={smsForm}
        />
        <Button
          href={phone && `tel:${phone}`}
          size="small"
          btnStyle={phone ? 'primary' : 'simple'}
          disabled={phone ? false : true}
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
            {__('Action')} <Icon icon="angle-down" />
          </>
        )}
      </Button>
    );
  }

  renderEditButton() {
    const { clientPortalUser } = this.props;

    const customerForm = (props) => {
      return (
        <ClientPortalUserForm
          {...props}
          size="lg"
          clientPortalUser={clientPortalUser}
        />
      );
    };

    return (
      <li>
        <ModalTrigger
          title="Upravit základní informace"
          trigger={<a href="#edit">{__('Edit')}</a>}
          size="lg"
          content={customerForm}
        />
      </li>
    );
  }

  renderDropdown() {
    const { remove, clientPortalUser } = this.props;

    const onClick = () =>
      confirm()
        .then(() => remove())
        .catch((error) => {
          Alert.error(error.message);
        });

    const extendSubscription = (props) => {
      if (!isEnabled('forum')) {
        return null;
      }

      // TODO: use loadDynamicComponent
      // return (
      //   <ExtendSubscription {...props} clientPortalUser={clientPortalUser} />
      // );
    };

    return (
      <Dropdown>
        <Dropdown.Toggle as={DropdownToggle} id="dropdown-action">
          {this.renderButton()}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {this.renderEditButton()}
          {isEnabled('forum') && (
            <ModalTrigger
              title="Prodloužit předplatné"
              trigger={
                <li>
                  <a href="#extend-subscription">{__('Extend Subscription')}</a>
                </li>
              }
              size="lg"
              content={extendSubscription}
            />
          )}
          <li>
            <a href="#delete" onClick={onClick}>
              {__('Delete')}
            </a>
          </li>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  render() {
    const { clientPortalUser } = this.props;

    return (
      <>
        {loadDynamicComponent(
          'clientPortalUserDetailAction',
          { clientPortalUser },
          true,
        )}
        <Actions>
          {this.renderActions()}
          {this.renderDropdown()}
        </Actions>
      </>
    );
  }
}

export default BasicInfoSection;
