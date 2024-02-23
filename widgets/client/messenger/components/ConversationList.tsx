import * as React from 'react';
import { iconPlus, iconSearch } from "../../icons/Icons";
import { __ } from "../../utils";
import ConversationItem from "../containers/ConversationItem";
import { IConversation } from "../types";
import TopBar from "../containers/TopBar";

type Props = {
  conversations: IConversation[];
  goToConversation: (conversationId: string) => void;
  createConversation: (e: React.FormEvent<HTMLLIElement>) => void;
  goToHome: () => void;
  loading: boolean;
};

function ConversationList(props: Props) {
  const {
    conversations,
    goToConversation,
    loading,
    createConversation,
    goToHome
  } = props;
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [ conversationList, setConversationList] = React.useState<IConversation[]>([]);

  React.useEffect(() => {
    
    if(!loading) {
      setConversationList(conversations);
    }

    if(searchValue) {
      setConversationList(result => result.filter(conv => conv.content.toString().toLowerCase().indexOf(searchValue.toLowerCase()) > -1));
    }
  }, [searchValue, loading]);

  if (loading) {
    return <div className="loader" />;
  }  

  const createButton = () => {
    return (
      <ul className="saashq-last-section">
        <li onClick={createConversation} className="saashq-create-btn">
          <span>{iconPlus}</span>
          <span className="saashq-start-text">{__("Start new conversation")}</span>
        </li>
      </ul>
    );
  };

  const searchButton = () => {
    return (
      <li className="saashq-list-item">
        <div className="saashq-left-side">
          <span>{iconSearch}</span>
        </div>
        <div className="saashq-right-side">
          <div className="saashq-name">
            <input type="text" onChange={(e) => setSearchValue(e.target.value)} placeholder="Search for a conversation..." value={searchValue} />
          </div>
        </div>
      </li>
    );
  }

  return (
    <>
    <TopBar
          middle={
          `Previous Conversations`
          }
          onLeftButtonClick={goToHome}
        />
        <div className="saashq-content">
        <ul className="saashq-conversation-list">
          {searchButton()}
          {conversationList.map(conversation => (
            <ConversationItem
              key={conversation._id}
              conversation={conversation}
              goToConversation={goToConversation}
            />
          ))}
        </ul>
        {createButton()}
      </div>
    </>
  );
}

export default ConversationList;
