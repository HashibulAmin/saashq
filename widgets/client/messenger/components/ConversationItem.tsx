import * as classNames from "classnames";
import * as dayjs from "dayjs";
import * as React from "react";
import { defaultAvatar } from "../../icons/Icons";
import { __, readFile, striptags } from "../../utils";
import { IConversation } from "../types";

type Props = {
  conversation: IConversation;
  notificationCount: number;
  goToConversation: (conversationId: string) => void;
};

function ConversationItem({
  conversation,
  notificationCount,
  goToConversation
}: Props) {
  const { _id, content, createdAt } = conversation;
  const participatedUsers = conversation.participatedUsers;
  let participatedUser = null;

  if (participatedUsers && participatedUsers.length > 0) {
    participatedUser = participatedUsers[0];
  }

  let avatar = defaultAvatar;
  let fullName = (__("Support staff") || {}).toString();

  if (participatedUser && participatedUser.details) {
    avatar = participatedUser.details.avatar || defaultAvatar;
    fullName = participatedUser.details.fullName || fullName;
  }

  return (
    <li
      className={classNames("saashq-list-item", {
        unread: notificationCount > 0
      })}
      onClick={() => {
        goToConversation(_id);
      }}
    >
      <img className="saashq-left-side" src={readFile(avatar)} alt={fullName} />
      <div className="saashq-right-side">
        <div
          className="saashq-date saashq-tooltip"
          data-tooltip={dayjs(createdAt).format("YYYY-MM-DD, HH:mm:ss")}
        >
          {dayjs(createdAt).format("LT")}
        </div>
        <div className="saashq-name">{fullName}</div>
        <div className="saashq-last-message">{striptags(content)}</div>
      </div>
    </li>
  );
}

export default ConversationItem;
