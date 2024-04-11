import Button from '@saashq/ui/src/components/Button';
import ConversationItem from '../../containers/leftSidebar/ConversationItem';
import { ConversationItems } from './styles';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import { IConversation } from '@saashq/ui-inbox/src/inbox/types';
import React from 'react';
import { __ } from '@saashq/ui/src/utils/core';

type Props = {
  conversations: IConversation[];
  currentConversationId?: string;
  selectedConversations?: IConversation[];
  onChangeConversation: (conversation: IConversation) => void;
  toggleRowCheckbox: (conversation: IConversation[], checked: boolean) => void;
  loading: boolean;
  totalCount: number;
  onLoadMore: () => void;
};

export default class ConversationList extends React.Component<Props> {
  renderLoadMore() {
    const { loading, conversations, totalCount, onLoadMore } = this.props;

    if (conversations.length >= totalCount) {
      return null;
    }

    return (
      <Button
        block={true}
        btnStyle="link"
        onClick={() => onLoadMore()}
        icon="redo"
        uppercase={false}
      >
        {loading ? 'Načítání...' : 'Načíst další'}
      </Button>
    );
  }

  render() {
    const {
      conversations,
      currentConversationId,
      selectedConversations,
      onChangeConversation,
      toggleRowCheckbox,
      loading,
    } = this.props;

    return (
      <React.Fragment>
        <ConversationItems id="conversations">
          {conversations.map((conv) => (
            <ConversationItem
              key={conv._id}
              conversation={conv}
              toggleCheckbox={toggleRowCheckbox}
              onClick={onChangeConversation}
              selectedIds={(selectedConversations || []).map(
                (conversation) => conversation._id,
              )}
              currentConversationId={currentConversationId}
            />
          ))}
        </ConversationItems>

        {!loading && conversations.length === 0 && (
          <EmptyState
            text="Pojďme vám poslat zprávy!"
            size="full"
            image="/images/actions/6.svg"
          />
        )}

        {this.renderLoadMore()}
      </React.Fragment>
    );
  }
}
