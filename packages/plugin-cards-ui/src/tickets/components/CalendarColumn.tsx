import {
  ColumnContainer,
  ColumnContentBody,
  ColumnFooter,
} from '@saashq/ui-cards/src/boards/components/Calendar';
import { AddNew } from '@saashq/ui-cards/src/boards/styles/stage';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import Icon from '@saashq/ui/src/components/Icon';
import { IDateColumn } from '@saashq/ui/src/types';
import { __ } from '@saashq/ui/src/utils/core';
import React from 'react';
import options from '@saashq/ui-cards/src/tickets/options';
import { ITicket } from '@saashq/ui-cards/src/tickets/types';
import Ticket from '@saashq/ui-cards/src/tickets/components/TicketItem';

type Props = {
  tickets: ITicket[];
  totalCount: number;
  date: IDateColumn;
  onLoadMore: (skip: number) => void;
};

class TicketColumn extends React.Component<Props, {}> {
  onLoadMore = () => {
    const { tickets, onLoadMore } = this.props;
    onLoadMore(tickets.length);
  };

  renderContent() {
    const { tickets } = this.props;

    if (tickets.length === 0) {
      return <EmptyState icon="postcard" text="Žádné vstupenky" />;
    }

    const contents = tickets.map((ticket: ITicket, index: number) => (
      <Ticket options={options} key={index} item={ticket} portable={true} />
    ));

    return <ColumnContentBody>{contents}</ColumnContentBody>;
  }

  renderFooter() {
    const { tickets, totalCount } = this.props;

    if (tickets.length === totalCount || tickets.length > totalCount) {
      return null;
    }

    return (
      <ColumnFooter>
        <AddNew onClick={this.onLoadMore}>
          <Icon icon="refresh" /> {__('Load more')}
        </AddNew>
      </ColumnFooter>
    );
  }

  render() {
    return (
      <ColumnContainer>
        {this.renderContent()}
        {this.renderFooter()}
      </ColumnContainer>
    );
  }
}

export default TicketColumn;
