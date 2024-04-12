import { IUser } from '@saashq/ui/src/auth/types';
import React from 'react';
import { __ } from 'modules/common/utils';
import {
  SaasHQMiddleTitle,
  SaasHQTopbar,
} from 'modules/saas/onBoarding/styles';

type Props = {
  color: string;
  textColor: string;
  message?: string;
  logoPreviewUrl?: string;
  currentUser: IUser;
};

class TopBar extends React.Component<Props> {
  renderTopBar() {
    return (
      <>
        <SaasHQMiddleTitle>
          <h3>Obecná Informace</h3>
        </SaasHQMiddleTitle>
      </>
    );
  }

  renderContent() {
    return this.renderTopBar();
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
