import Button from '@saashq/ui/src/components/Button';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import Info from '@saashq/ui/src/components/Info';
import { ModalFooter } from '@saashq/ui/src/styles/main';
import { __, getEnv } from 'coreui/utils';
import { MarkdownWrapper } from '@saashq/ui-settings/src/styles';
import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import ReactMarkdown from 'react-markdown';
import { IBookingIntegration } from '../types';

type Props = {
  integration: IBookingIntegration;
  closeModal: () => void;
};

type State = {
  code?: string;
  embedCode?: string;
  buttonCode?: string;
  copied: boolean;
};

const installCodeIncludeScript = (type: string) => {
  const { REACT_APP_CDN_HOST } = getEnv();

  return `
    (function() {
      var script = document.createElement('script');
      script.src = "${REACT_APP_CDN_HOST}/build/${type}Widget.bundle.js";
      script.async = true;

      var entry = document.getElementsByTagName('script')[0];
      entry.parentNode.insertBefore(script, entry);
    })();
  `;
};

const getInstallCode = (integrationId: string) => {
  return `
    <div data-saashq-booking style="width:100%;height:100vh"></div>
    <script>
      window.saashqSettings = {
        booking: {
          integration_id: "${integrationId}",
        },
      };
      ${installCodeIncludeScript('booking')}
    </script>
  `;
};

function Manage({ integration, closeModal }: Props) {
  let installCode = '';

  installCode = getInstallCode(integration._id || '');

  const [state, setState] = useState<State>({
    code: installCode,
    copied: false,
  });

  const onSimulate = () => {
    const { REACT_APP_CDN_HOST } = getEnv();

    window.open(
      `${REACT_APP_CDN_HOST}/test?type=booking&integration_id=${integration._id}`,
      'bookingWindow',
      'width=800,height=800',
    );
  };

  const renderContent = () => {
    const onCopy = () => setState({ ...state, copied: true });

    const { code, copied } = state;

    return (
      <>
        <MarkdownWrapper>
          <ReactMarkdown children={code || ''} />
          {code ? (
            <CopyToClipboard text={code} onCopy={onCopy}>
              <Button btnStyle="primary" icon="copy-1">
                {copied ? 'Zkopírováno' : 'Zkopírovat do schránky'}
              </Button>
            </CopyToClipboard>
          ) : (
            <EmptyState
              icon="copy"
              text="Žádný kopírovatelný kód"
              size="small"
            />
          )}
        </MarkdownWrapper>
      </>
    );
  };
  return (
    <>
      <Info>
        {__(
          ' Paste this main code before the body tag on every page you want this booking to appear.',
        )}
      </Info>

      {renderContent()}
      <ModalFooter>
        <Button btnStyle="primary" icon="plus-circle" onClick={onSimulate}>
          Simulovat
        </Button>

        <Button btnStyle="simple" icon="times-circle" onClick={closeModal}>
          Zavřít
        </Button>
      </ModalFooter>
    </>
  );
}

export default Manage;
