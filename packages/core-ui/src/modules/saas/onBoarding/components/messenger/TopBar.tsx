import { IUser } from '@saashq/ui/src/auth/types';
import Icon from '@saashq/ui/src/components/Icon';
import React from 'react';
import { __ } from 'modules/common/utils';
import {
  SaasHQGreeting,
  SaasHQTopbar,
  GreetingInfo,
  Links,
  Socials,
  TopBarIcon,
  TopBarTab,
} from 'modules/saas/onBoarding/styles';
import Supporters from './Supporters';

type Props = {
  color: string;
  textColor: string;
  message?: string;
  logoPreviewUrl?: string;
  currentUser: IUser;
  avatar: string;
  brandName: string;
};

class TopBar extends React.Component<Props> {
  renderIcons(icon: string, left?: boolean, size?: number) {
    return (
      <TopBarIcon isLeft={left || false}>
        <Icon icon={icon} size={size || 24} />
      </TopBarIcon>
    );
  }

  renderLink(icon) {
    return (
      <a href="#icon">
        <Icon icon={icon} size={18} />
      </a>
    );
  }

  renderSupporters() {
    const { currentUser, avatar } = this.props;

    return (
      <Supporters isOnline={false} currentUser={currentUser} avatar={avatar} />
    );
  }

  renderGreetingTitle(message) {
    const { brandName } = this.props;

    if (message) {
      return <h3>{message}</h3>;
    }

    return <h3>{__('Dobrý den, jsme ') + `${brandName!}`}</h3>;
  }

  renderGreetingMessage(message) {
    if (message) {
      return <p>{message}</p>;
    }

    return (
      <p>
        {__(
          'Jsme k dispozici mezi 9:00 a 18:00 (GMT +8). Pokud se připojujete mimo výše uvedenou dobu, zanechte nám prosím zprávu. Ozveme se vám co nejdříve.',
        )}{' '}
      </p>
    );
  }

  renderGreetings() {
    const { message } = this.props;

    return (
      <GreetingInfo>
        {this.renderGreetingTitle(message)}
        {this.renderGreetingMessage(message)}
      </GreetingInfo>
    );
  }

  renderTabs() {
    return (
      <TopBarTab>
        <div style={{ backgroundColor: this.props.color }} />
        <span>{__('Podpěra')}</span>
        <span>{__('Faq')}</span>
      </TopBarTab>
    );
  }

  renderGreetingTopbar() {
    return (
      <>
        <SaasHQGreeting>
          <Links>
            <Socials>
              {this.renderLink('facebook-official')}
              {this.renderLink('twitter')}
              {this.renderLink('youtube-play')}
            </Socials>
          </Links>

          {this.renderGreetings()}
          {this.renderSupporters()}
          {this.renderTabs()}
        </SaasHQGreeting>
        {this.renderIcons('cancel', false, 11)}
      </>
    );
  }

  renderContent() {
    return this.renderGreetingTopbar();
  }

  render() {
    const { color, textColor } = this.props;

    return (
      <SaasHQTopbar style={{ backgroundColor: color, color: textColor }}>
        {this.renderContent()}
      </SaasHQTopbar>
    );
  }
}

export default TopBar;
