import Button from '@saashq/ui/src/components/Button';
import { __, bustIframe } from '../../utils';
import React from 'react';
import Container from 'react-bootstrap/Container';
import {
  AuthWrapper,
  AuthBox,
  AuthItem,
  AuthContent,
  AuthCustomDescription,
  AuthDescription,
  CenterContent,
  MobileRecommend,
} from '../styles';
import { getThemeItem } from '../../utils/core';

type Props = {
  content: React.ReactNode;
  description?: React.ReactNode;
  col?: { first: number; second: number };
};

class AuthLayout extends React.Component<Props, {}> {
  renderContent(desciption: string, link: string) {
    return (
      <MobileRecommend>
        <CenterContent>
          <div>
            <b>{__('SaasHQ Inc')}</b>
            <div>{__(desciption)}</div>
          </div>
          <Button btnStyle="link" size="small" href={link}>
            {__('Get')}
          </Button>
        </CenterContent>
      </MobileRecommend>
    );
  }

  renderRecommendMobileVersion() {
    const { userAgent } = navigator;

    if (userAgent.indexOf('Mobile') !== -1) {
      if (userAgent.match(/Android/i)) {
        return this.renderContent(
          'Stáhněte si aplikaci pro Android zdarma na Google Play',
          'https://play.google.com/store/apps/details?id=io.saashq.saashq_android&fbclid=IwAR1bVPBSE0pC_KUNNjOJQA4upb1AuTUfqFcDaHTHTptyke7rNvuvb2mgwb0',
        );
      }
    }

    return null;
  }

  renderDesciption() {
    const { description } = this.props;

    if (description) {
      return (
        <AuthCustomDescription>
          <img src="/images/logo.png" alt="saashq" />
          {description}
        </AuthCustomDescription>
      );
    }

    return (
      <AuthDescription>
        <h1>
          {getThemeItem('motto') ||
            __('Rozvíjejte své podnikání lépe a rychleji')}
        </h1>
        <h2>
          {getThemeItem('login_page_description') || (
            <>
              {__('Singl ')}
              <b>{__('zkušenosti s operačním systémem (SHQ)')}</b>
              {__(' sladit celé vaše podnikání')}
            </>
          )}
        </h2>
      </AuthDescription>
    );
  }

  componentDidMount() {
    // click-jack attack defense
    bustIframe();
  }

  render() {
    const { content } = this.props;

    return (
      <AuthWrapper>
        <Container>
          <AuthBox>
            <AuthItem order={1}>
              <AuthContent>{content}</AuthContent>
            </AuthItem>
            <AuthItem order={0}>{this.renderDesciption()}</AuthItem>
          </AuthBox>
          {this.renderRecommendMobileVersion()}
        </Container>
      </AuthWrapper>
    );
  }
}

export default AuthLayout;
