import * as React from "react";
import { iconPlus } from "../../icons/Icons";
import { __ } from "../../utils";
import ConversationItem from "../containers/ConversationItem";
import { IConversation } from "../types";

type Props = {
  conversations: IConversation[];
  goToConversation: (conversationId: string) => void;
  createConversation: (e: React.FormEvent<HTMLLIElement>) => void;
  loading: boolean;
  goToAllConversations: (e: React.FormEvent<HTMLLIElement>) => void;
  responseRate?: string;
};

function ConversationInit(props: Props) {
  const {
    conversations,
    goToConversation,
    loading,
    createConversation,
    goToAllConversations,
    responseRate
  } = props;

  if (loading) {
    return <div className="loader" />;
  }

  const createButton = () => {
    return (
      <li onClick={createConversation} className="saashq-list-item">
        <div className="saashq-left-side">
          <span>{iconPlus}</span>
        </div>
        <div className="saashq-right-plus">
          <div className="saashq-name">{__("Start new conversation")}</div>
          <div className="saashq-last-message">
            {__("Our usual response time")}<br /> 
            <strong>{responseRate}</strong>
          </div>
        </div>
      </li>
    );
  };

  const seeAllConversationBtn = () => {
    return (
      <li onClick={goToAllConversations} className="saashq-list-item">
        <div className="saashq-right-side">
          <div className="saashq-last-message">
            {__("See all your conversations")}
          </div>
        </div>
      </li>
    )
  }

  return (
    <>
      <ul className="saashq-conversation-init">
        {conversations.length > 0 &&
          <ConversationItem
            key={conversations[0]._id}
            conversation={conversations[0]}
            goToConversation={goToConversation}
          />}
        {conversations.length > 1 && seeAllConversationBtn()}
        {createButton()}
      </ul>
    </>
  );
}

export default ConversationInit;
