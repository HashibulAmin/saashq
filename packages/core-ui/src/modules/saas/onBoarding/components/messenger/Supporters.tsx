import { IUser } from '@saashq/ui/src/auth/types';
import React from 'react';
import { __, readFile } from 'modules/common/utils';
import {
  SaasHQStaffProfile,
  StateSpan,
  SaasHQSupporters,
} from 'modules/saas/onBoarding/styles';

type Props = {
  currentUser: IUser;
  isOnline: boolean;
  avatar: string;
};

class Supporters extends React.Component<Props> {
  getUserAvatar = (avatarUrl) => {
    const { avatar } = this.props;

    if (!avatar) {
      return '/images/avatar-colored.svg';
    }

    return readFile(avatarUrl);
  };

  renderContent() {
    const { isOnline, currentUser, avatar } = this.props;

    return (
      <SaasHQStaffProfile>
        <div className="avatar">
          <img
            src={this.getUserAvatar(avatar)}
            alt={currentUser?.details?.fullName || ''}
          />
          <StateSpan state={isOnline || false} />
        </div>
      </SaasHQStaffProfile>
    );
  }

  render() {
    return <SaasHQSupporters>{this.renderContent()}</SaasHQSupporters>;
  }
}

export default Supporters;
