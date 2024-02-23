import * as dayjs from "dayjs";
import * as React from "react";
import { iconLeft } from "../../../icons/Icons";
import { __, makeClickableLink } from "../../../utils";
import TopBar from "../../containers/TopBar";
import { IFaqArticle, IFaqCategory } from "../../types";

type Props = {
  article: IFaqArticle | null;
  goToCategory: (category?: IFaqCategory) => void;
};

export default class ArticleDetail extends React.PureComponent<Props> {
  componentDidMount() {
    makeClickableLink(".saashq-article-content a");
  }

  renderHead = (title: string) => {
    return (
      <div className="saashq-topbar-title limited">
        <div>{title}</div>
      </div>
    );
  };

  render() {
    const { article, goToCategory } = this.props;

    if (!article) {
      return <div className="loader bigger" />;
    }

    const { createdDate, title, summary, content } = article;

    const onClick = () => {
      goToCategory();
    };

    return (
      <>
        <TopBar
          middle={this.renderHead(title)}
          buttonIcon={iconLeft()}
          onLeftButtonClick={onClick}
        />
        <div className="saashq-content">
          <div className="saashq-content slide-in">
            <div className="saashq-article-content">
              <h2>{title}</h2>
              <div className="date">
                {__("Created ")}:{" "}
                <span>{dayjs(createdDate).format("lll")}</span>
              </div>
              <p>{summary}</p>
              <p dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </div>
        </div>
      </>
    );
  }
}
