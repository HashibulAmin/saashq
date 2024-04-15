import { __, getEnv } from '@saashq/ui/src/utils';

import Button from '@saashq/ui/src/components/Button';
import Info from '@saashq/ui/src/components/Info';
import { IntegrationMutationVariables } from '@saashq/ui-inbox/src/settings/integrations/types';
import { ModalFooter } from '@saashq/ui/src/styles/main';
import React from 'react';
import { RefreshPermission } from '../../styles';

type CommonTypes = {
  name: string;
  brandId: string;
  channelIds: string[];
  webhookData: any;
};

type Props = {
  integrationId: string;
  integrationKind: string;
  name: string;
  brandId: string;
  channelIds: string[];
  webhookData: any;
  onSubmit: (
    id: string,
    { name, brandId, channelIds, data }: IntegrationMutationVariables,
  ) => void;
  closeModal: () => void;
};

class RefreshPermissionForm extends React.PureComponent<Props, CommonTypes> {
  constructor(props: Props) {
    super(props);

    this.state = {
      name: props.name || '',
      brandId: props.brandId || '',
      channelIds: props.channelIds || [],
      webhookData: props.webhookData || {},
    };
  }

  popupWindow(url, title, win, w, h) {
    const y = win.top.outerHeight / 2 + win.top.screenY - h / 2;
    const x = win.top.outerWidth / 2 + win.top.screenX - w / 2;

    return win.open(
      url,
      title,
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`,
    );
  }

  renderFacebookContent = () => {
    const onClick = () => {
      const { REACT_APP_API_URL } = getEnv();
      const url = `${REACT_APP_API_URL}/pl:facebook/fblogin?kind=facebook`;

      this.popupWindow(url, 'Integrace', window, 660, 750);
    };

    return (
      <>
        <Info>
          {__(
            'Oprávnění ke stránce může platforma Messenger zrušit, pokud správce stránky změní heslo k účtu nebo z jiného neočekávaného důvodu. V případě jakýchkoliv problémů s odesíláním zpráv nebo s používáním jiné služby prosím obnovte svá oprávnění pomocí níže uvedeného tlačítka.',
          )}
          <RefreshPermission onClick={onClick}>
            Obnovit oprávnění
          </RefreshPermission>
        </Info>
      </>
    );
  };

  renderInstagramContent = () => {
    const onClick = () => {
      const { REACT_APP_API_URL } = getEnv();
      const url = `${REACT_APP_API_URL}/pl:instagram/iglogin?kind=instagram`;

      this.popupWindow(url, 'Integrace', window, 660, 750);
    };

    return (
      <>
        <Info>
          {__(
            'Oprávnění ke stránce může platforma Messenger zrušit, pokud správce stránky změní heslo k účtu nebo z jiného neočekávaného důvodu. V případě jakýchkoliv problémů s odesíláním zpráv nebo s používáním jiné služby prosím obnovte svá oprávnění pomocí níže uvedeného tlačítka.',
          )}
          <RefreshPermission onClick={onClick}>
            Obnovit oprávnění
          </RefreshPermission>
        </Info>
      </>
    );
  };

  render() {
    const { closeModal } = this.props;
    return (
      <>
        {this.props.integrationKind === 'instagram-messenger' ||
        this.props.integrationKind === 'instagram'
          ? this.renderInstagramContent()
          : this.renderFacebookContent()}
        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            onClick={closeModal}
            icon="times-circle"
          >
            Zrušení
          </Button>
        </ModalFooter>
      </>
    );
  }
}

export default RefreshPermissionForm;
