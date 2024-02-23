import React from "react";
import Widget from "../components/Widget";
import { NotifConsumer, NotifProvider } from "../context";
import withCurrentUser from "@saashq/ui/src/auth/containers/withCurrentUser";
import { IUser } from "@saashq/ui/src/auth/types";

type Props = {
  currentUser: IUser;
};

const WidgetContainer = (props: Props) => (
  <NotifProvider currentUser={props.currentUser}>
    <NotifConsumer>
      {({
        unreadCount,
        notifications,
        isLoading,
        showNotifications,
        markAsRead,
        currentUser,
      }) => {
        const updatedProps = {
          unreadCount,
          notifications,
          isLoading,
          showNotifications,
          markAsRead,
          currentUser,
        };
        return <Widget {...updatedProps} />;
      }}
    </NotifConsumer>
  </NotifProvider>
);

export default withCurrentUser(WidgetContainer);
