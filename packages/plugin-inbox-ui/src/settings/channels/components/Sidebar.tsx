import Button from '@saashq/ui/src/components/Button';
import ChannelForm from '@saashq/ui-inbox/src/settings/channels/containers/ChannelForm';
import ChannelRow from './ChannelRow';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import { Header } from '@saashq/ui-settings/src/styles';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import { IChannel } from '@saashq/ui-inbox/src/settings/channels/types';
import LeftSidebar from '@saashq/ui/src/layout/components/Sidebar';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import React from 'react';
import { SidebarList } from '@saashq/ui/src/layout/styles';
import Spinner from '@saashq/ui/src/components/Spinner';

type Props = {
  channels: IChannel[];
  remove: (channelId: string) => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  loading: boolean;
  currentChannelId?: string;
  channelsTotalCount: number;
};

class Sidebar extends React.Component<Props, {}> {
  renderItems = () => {
    const { channels, remove, currentChannelId, renderButton } = this.props;

    return channels.map((channel) => (
      <ChannelRow
        key={channel._id}
        isActive={currentChannelId === channel._id}
        channel={channel}
        members={channel.members}
        remove={remove}
        renderButton={renderButton}
      />
    ));
  };

  renderSidebarHeader() {
    const { renderButton } = this.props;

    const addChannel = (
      <Button btnStyle="success" block={true} icon="plus-circle">
        Přidat nový kanál
      </Button>
    );

    const content = (props) => (
      <ChannelForm {...props} renderButton={renderButton} />
    );

    return (
      <Header>
        <ModalTrigger
          title="Nový kanál"
          autoOpenKey="showChannelAddModal"
          trigger={addChannel}
          content={content}
        />
      </Header>
    );
  }

  render() {
    const { loading, channelsTotalCount } = this.props;

    return (
      <LeftSidebar
        wide={true}
        hasBorder={true}
        header={this.renderSidebarHeader()}
      >
        <SidebarList noTextColor={true} noBackground={true}>
          {this.renderItems()}
        </SidebarList>
        {loading && <Spinner />}
        {!loading && channelsTotalCount === 0 && (
          <EmptyState
            image="/images/actions/18.svg"
            text="Neexistuje žádný kanál"
          />
        )}
      </LeftSidebar>
    );
  }
}

export default Sidebar;
