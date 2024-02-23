import { IUser, IUserDetails } from '@saashq/ui/src/auth/types';

import Button from '@saashq/ui/src/components/Button';
import Icon from '@saashq/ui/src/components/Icon';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import React from 'react';
import SmsForm from '@saashq/ui-inbox/src/settings/integrations/containers/telnyx/SmsForm';
import Tip from '@saashq/ui/src/components/Tip';
import { __ } from '@saashq/ui/src/utils';
import EmailWidget from '@saashq/ui-inbox/src/inbox/components/EmailWidget';
import { isEnabled } from '@saashq/ui/src/utils/core';

type Props = {
  user: IUser;
};

class ActionForms extends React.Component<Props, {}> {
  render() {
    const { user } = this.props;
    const { operatorPhone } = user.details || ({} as IUserDetails);

    const smsForm = props => (
      <SmsForm {...props} primaryPhone={operatorPhone} />
    );

    return (
      <>
        {(isEnabled('engages') || isEnabled('imap')) && (
          <EmailWidget
            disabled={user.email ? false : true}
            buttonStyle={user.email ? 'primary' : 'simple'}
            emailTo={user.email}
            customerId={user._id || undefined}
            buttonSize="small"
            type="action"
          />
        )}

        <ModalTrigger
          dialogClassName="middle"
          title={`Send SMS to (${operatorPhone})`}
          trigger={
            <Button
              disabled={operatorPhone ? false : true}
              size="small"
              btnStyle={operatorPhone ? 'primary' : 'simple'}
            >
              <Tip text="Send SMS" placement="top-end">
                <Icon icon="message" />
              </Tip>
            </Button>
          }
          content={smsForm}
        />
      </>
    );
  }
}

export default ActionForms;
