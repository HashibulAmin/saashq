import { dimensions } from '@saashq/ui/src/styles';
import { AlertItem } from '@saashq/ui/src/utils/Alert/Alert';
import React from 'react';
import RTG from 'react-transition-group';
import styled from 'styled-components';
import Icon from '@saashq/ui/src/components/Icon';
import { __ } from '../../utils/core';

const OldBrowserWarning = styled(AlertItem)`
  position: fixed;
  left: ${dimensions.headerSpacing}%;
  margin-left: -250px;
  width: 500px;
  transition: all 0.1s;

  > div {
    margin-top: ${dimensions.unitSpacing - 5}px;
    font-size: 12px;
  }

  .icon-cancel {
    float: right;
    cursor: pointer;
  }
`;

type State = {
  isVisible: boolean;
};

class DetectBrowser extends React.PureComponent<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = { isVisible: true };
  }

  closeAlert = () => {
    this.setState({ isVisible: false });
  };

  renderWarning(name: string, minVersion: number) {
    const { userAgent } = navigator;

    const splittedVersion = userAgent.split(name)[1];
    const browserVersion = splittedVersion.split('.')[0];

    if (Number(browserVersion) < minVersion) {
      return (
        <RTG.CSSTransition
          in={this.state.isVisible}
          appear={true}
          timeout={300}
          classNames="slide-in-small"
          unmountOnExit={true}
        >
          <OldBrowserWarning type="error">
            <b>
              {__('Upgradujte svůj prohlížeč, abyste mohli používat SaasHQ!')}
              <Icon icon="cancel" size={10} onClick={this.closeAlert} />
            </b>
            <div>
              {__(
                'Bohužel používáte prohlížeč, který nemusí být plně kompatibilní se SaasHQ',
              )}{' '}
              {__(`Použijte prosím doporučenou verzi`)} -{' '}
              {name.replace('/', '')} {minVersion}+.
            </div>
          </OldBrowserWarning>
        </RTG.CSSTransition>
      );
    }

    return null;
  }

  render() {
    const { userAgent } = navigator;

    if (userAgent.indexOf('Chrome') !== -1) {
      return this.renderWarning('Chrome/', 58);
    }

    if (
      userAgent.indexOf('Safari') !== -1 &&
      userAgent.indexOf('Chrome') === -1
    ) {
      return this.renderWarning('Version/', 11);
    }

    if (userAgent.indexOf('Firefox') !== -1) {
      return this.renderWarning('Firefox/', 59);
    }

    if (userAgent.indexOf('Opera') !== -1 || userAgent.indexOf('OPR') !== -1) {
      return this.renderWarning('Opera/', 45);
    }

    if (userAgent.indexOf('Edge') !== -1) {
      return this.renderWarning('Edge/', 16);
    }

    return null;
  }
}

export default DetectBrowser;
