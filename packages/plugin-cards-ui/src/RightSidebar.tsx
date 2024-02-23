import { IUser } from '@saashq/ui/src/auth/types';
import React from 'react';
import Sidebar from '@saashq/ui/src/layout/components/Sidebar';
import asyncComponent from '@saashq/ui/src/components/AsyncComponent';

type Props = {
  user: IUser;
};

const PortableDeals = asyncComponent(() =>
  import(
    /* webpackChunkName: "PortableDeals" */ '@saashq/ui-cards/src/deals/components/PortableDeals'
  )
);

const PortableTasks = asyncComponent(() =>
  import(
    /* webpackChunkName: "PortableTasks" */ '@saashq/ui-cards/src/tasks/components/PortableTasks'
  )
);

const PortableTickets = asyncComponent(() =>
  import(
    /* webpackChunkName: "PortableTickets" */ '@saashq/ui-cards/src/tickets/components/PortableTickets'
  )
);

const PortablePurchases = asyncComponent(() =>
  import(
    /* webpackChunkName: "PortablePurchases" */ '@saashq/ui-cards/src/purchases/components/PortablePurchases'
  )
);

export default class RightSidebar extends React.Component<Props> {
  render() {
    const { user } = this.props;

    return (
      <Sidebar>
        <PortableTasks mainType="user" mainTypeId={user._id} />
        <PortableDeals mainType="user" mainTypeId={user._id} />
        <PortableTickets mainType="user" mainTypeId={user._id} />
        <PortablePurchases mainType="user" mainTypeId={user._id} />
      </Sidebar>
    );
  }
}
