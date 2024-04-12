import { AddOns, Addon } from '../styles';
import {
  CardInformation,
  ColorHeader,
  DetailCard,
  MemberPic,
  PluginContainer,
  SidebarBox,
  SidebarWrapper,
  SmallText,
} from '../../styles';

import Button from '@saashq/ui/src/components/Button';
import Icon from '@saashq/ui/src/components/Icon';
import { Link } from 'react-router-dom';
import React from 'react';
import { __ } from 'modules/common/utils';

type Props = {
  plugin: any;
  plugins: any;
};

export default class RightSidebar extends React.Component<Props> {
  renderCreator() {
    const { creator } = this.props.plugin || {};
    const { logo, address, description, email, name, phone } =
      creator || ({} as any);

    return (
      <SidebarBox>
        <ColorHeader>{__('Tvůrce')}</ColorHeader>
        <DetailCard>
          <MemberPic>
            <img src={logo ? logo : '/images/glyph_dark.png'} alt="creator" />
          </MemberPic>
          <CardInformation>
            <b>{name || 'SaasHQ Inc'}</b>
            <div dangerouslySetInnerHTML={{ __html: description }} />
            <SmallText withMargin={true}>
              <b>{__('Adresa')}:</b>{' '}
              {address || '1931 Norris Ave., Fort Erie, ON, Canada, L2A5M4'}
            </SmallText>
            <SmallText withMargin={true}>
              <b>{__('Tel')}</b>: {phone || '+1 289 303 7651'}
            </SmallText>
            <SmallText>
              <b>{__('E-mailem')}</b>: {email || 'info@saashq.org'}
            </SmallText>
          </CardInformation>
        </DetailCard>
      </SidebarBox>
    );
  }

  renderShare() {
    return (
      <SidebarBox>
        <ColorHeader>Useful links</ColorHeader>
        <PluginContainer>
          <Button
            href="https://github.com/saashq/saashq"
            target="_blank"
            btnStyle="simple"
          >
            <Icon icon="github-circled" size={20} />
            <b>Github</b>
          </Button>
          <Button
            href="https://www.facebook.com/saashqHQ"
            target="_blank"
            btnStyle="simple"
          >
            <Icon icon="facebook-official" size={20} />
            <b>Facebook</b>
          </Button>
          <Button
            href="https://twitter.com/saashqHQ"
            target="_blank"
            btnStyle="simple"
          >
            <Icon icon="twitter" size={20} />
            <b>Twitter</b>
          </Button>
        </PluginContainer>
      </SidebarBox>
    );
  }

  renderDependencies() {
    const { dependencies } = this.props.plugin || {};

    if (!dependencies || dependencies.length === 0) {
      return null;
    }

    const dependentPlugins = this.props.plugins.filter((item) =>
      dependencies.includes(item._id),
    );

    return (
      <SidebarBox>
        <ColorHeader>Dependent plugins</ColorHeader>
        <AddOns>
          {(dependentPlugins || []).map((dependency) => (
            <Link
              to={`installer/details/${dependency._id}`}
              key={dependency._id}
            >
              <Addon>
                <img
                  src={
                    dependency.avatar ||
                    dependency.icon ||
                    '/images/no-plugin.png'
                  }
                  alt="dependency-plugin"
                />
                {__(dependency.title)}
              </Addon>
            </Link>
          ))}
        </AddOns>
      </SidebarBox>
    );
  }

  renderRelatedPlugins() {
    const { relatedPlugins } = this.props.plugin || {};

    if (!relatedPlugins || relatedPlugins.length === 0) {
      return null;
    }

    const relations = this.props.plugins.filter((item) =>
      relatedPlugins.includes(item._id),
    );

    return (
      <SidebarBox>
        <ColorHeader>Related plugins</ColorHeader>
        <AddOns>
          {(relations || []).map((related) => (
            <Link to={`installer/details/${related._id}`} key={related._id}>
              <Addon>
                <img
                  src={
                    related.avatar || related.icon || '/images/no-plugin.png'
                  }
                  alt="related-plugin"
                />
                {__(related.title)}
              </Addon>
            </Link>
          ))}
        </AddOns>
      </SidebarBox>
    );
  }

  render() {
    return (
      <SidebarWrapper>
        {this.renderCreator()}
        {this.renderShare()}
        {this.renderDependencies()}
        {this.renderRelatedPlugins()}
        <Button
          href="https://github.com/saashq/saashq/issues"
          target="_blank"
          block={true}
        >
          <Icon icon="exclamation-circle" size={18} />
          &nbsp;Report an issue
        </Button>
      </SidebarWrapper>
    );
  }
}
