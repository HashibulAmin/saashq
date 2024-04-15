import Button from '@saashq/ui/src/components/Button';
import NameCard from '@saashq/ui/src/components/nameCard/NameCard';
import React from 'react';
import { IMessage } from '../../../../../types';
import { AppMessageBox, CallButton, FlexItem, UserInfo } from '../styles';

type Props = {
  message: IMessage;
};

export default class AppMessage extends React.Component<Props, {}> {
  render() {
    const { messengerAppData = {} } = this.props.message;
    const customerName =
      messengerAppData.customer && messengerAppData.customer.firstName;

    return (
      <FlexItem>
        <AppMessageBox>
          <UserInfo>
            <NameCard.Avatar customer={messengerAppData.customer} size={60} />
            <h4>Setkat se s {customerName}</h4>
          </UserInfo>
          <CallButton>
            <h5>Schůzka Připravena</h5>
            <a
              href={messengerAppData.hangoutLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>Připojte se k Hovoru</Button>
            </a>
          </CallButton>
        </AppMessageBox>
      </FlexItem>
    );
  }
}
