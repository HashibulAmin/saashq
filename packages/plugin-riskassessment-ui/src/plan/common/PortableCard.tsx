import React from 'react';
import * as compose from 'lodash.flowright';
import { graphql } from '@apollo/client/react/hoc';
import { gql } from '@apollo/client';
import TicketItem from '@saashq/ui-cards/src/tickets/components/TicketItem';
import TaskItem from '@saashq/ui-cards/src/tasks/components/TaskItem';
import ticketOptions from '@saashq/ui-cards/src/tickets/options';
import taskOptions from '@saashq/ui-cards/src/tasks/options';
import { withProps } from '@saashq/ui/src/utils/core';
import { Spinner } from '@saashq/ui/src';
import { IItem } from '@saashq/ui-cards/src/boards/types';

type Props = {
  type: string;
  id: string;
};

type FinalProps = {
  detailQuery: any;
} & Props;

type State = {
  openItemId: string;
};

class PortableTask extends React.Component<FinalProps, State> {
  constructor(props) {
    super(props);

    this.state = {
      openItemId: ''
    };
  }

  render() {
    const { detailQuery, type } = this.props;

    let options;
    let Component;

    switch (type) {
      case 'ticket':
        options = ticketOptions;
        Component = TicketItem;
        break;
      case 'task':
        options = taskOptions;
        Component = TaskItem;
        break;
      default:
        break;
    }

    const { queriesName } = options;
    if (detailQuery.loading) {
      return <Spinner objective />;
    }
    if (detailQuery.error) {
      return null;
    }

    const detail = detailQuery[queriesName.detailQuery] || null;

    if (!detail) {
      return null;
    }

    const onItemClick = (item: IItem) => {
      this.setState({ openItemId: item._id });
    };
    const beforePopupClose = () => {
      this.setState({ openItemId: '' });
    };

    return (
      <Component
        options={options}
        item={detail}
        isFormVisible={!!this.state.openItemId}
        onClick={onItemClick.bind(this, detail)}
        beforePopupClose={beforePopupClose}
        portable={true}
      />
    );
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(ticketOptions.queries.detailQuery), {
      name: 'detailQuery',
      skip: ({ id, type }) => !id || type !== 'ticket',
      options: ({ id }) => ({
        variables: { _id: id }
      })
    }),
    graphql<Props>(gql(taskOptions.queries.detailQuery), {
      name: 'detailQuery',
      skip: ({ id, type }) => !id || type !== 'task',
      options: ({ id }) => ({
        variables: { _id: id }
      })
    })
  )(PortableTask)
);
