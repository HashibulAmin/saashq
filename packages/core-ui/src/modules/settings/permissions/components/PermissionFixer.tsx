import Button from 'modules/common/components/Button';
import Info from 'modules/common/components/Info';
import TextInfo from 'modules/common/components/TextInfo';
import { ModalFooter } from 'modules/common/styles/main';
import { Alert } from 'modules/common/utils';
import React from 'react';

type Props = {
  closeModal: () => void;
  fixPermissions: () => Promise<any>;
};

type State = {
  messages: string[];
};

export default class PermissionFixer extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
    };
  }

  renderMessages() {
    const { messages } = this.state;

    if (messages.length > 0) {
      return (
        <ul>
          {messages.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      );
    }

    return null;
  }

  render() {
    const { closeModal, fixPermissions } = this.props;

    const fix = () => {
      fixPermissions()
        .then(({ data }) => {
          const messages =
            data && data.permissionsFix ? data.permissionsFix : [];

          this.setState({
            messages:
              messages.length > 0 ? messages : ['Všechno bylo v pořádku'],
          });
        })
        .catch((e) => {
          Alert.error(e.message);
        });
    };

    return (
      <>
        <Info>
          Když má člen týmu všechna oprávnění konkrétního modulu a
          <TextInfo> nemůže provádět některé akce</TextInfo>, pak tento příkaz
          přichází na pomoc.
        </Info>
        {this.renderMessages()}
        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            onClick={closeModal}
            icon="cancel-1"
          >
            Zrušení
          </Button>
          <Button btnStyle="success" type="button" onClick={fix} icon="wrench">
            Opravit
          </Button>
        </ModalFooter>
      </>
    );
  }
}
