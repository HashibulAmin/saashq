import Button from '@saashq/ui/src/components/Button';
import DataWithLoader from '@saashq/ui/src/components/DataWithLoader';
import { Header } from '@saashq/ui-settings/src/styles';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import { ITopic } from '@saashq/ui-knowledgeBase/src/types';
import KnowledgeForm from '../../containers/knowledge/KnowledgeForm';
import KnowledgeRow from './KnowledgeRow';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import React from 'react';
import Sidebar from '@saashq/ui/src/layout/components/Sidebar';

type Props = {
  queryParams: any;
  currentCategoryId: string;
  count?: number;
  loading: boolean;
  topics: ITopic[];
  articlesCount: number;
  refetch: () => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  remove: (knowledgeBaseId: string) => void;
};

class KnowledgeList extends React.Component<Props> {
  renderTopics() {
    const {
      topics,
      remove,
      renderButton,
      currentCategoryId,
      queryParams,
      articlesCount,
      refetch
    } = this.props;

    return (
      <>
        {topics.map(topic => (
          <KnowledgeRow
            currentCategoryId={currentCategoryId}
            key={topic._id}
            topic={topic}
            queryParams={queryParams}
            articlesCount={articlesCount}
            remove={remove}
            renderButton={renderButton}
            refetchTopics={refetch}
          />
        ))}
      </>
    );
  }

  renderSidebarHeader() {
    const trigger = (
      <Button btnStyle="success" block={true} icon="plus-circle">
        Add Knowledge Base
      </Button>
    );

    const content = props => (
      <KnowledgeForm {...props} renderButton={this.props.renderButton} />
    );

    return (
      <Header>
        <ModalTrigger
          title="Add Knowledge Base"
          autoOpenKey="showKBAddModal"
          trigger={trigger}
          content={content}
          enforceFocus={false}
        />
      </Header>
    );
  }

  render() {
    const { topics, loading } = this.props;

    return (
      <Sidebar wide={true} header={this.renderSidebarHeader()} hasBorder={true}>
        <DataWithLoader
          data={this.renderTopics()}
          loading={loading}
          count={topics.length}
          emptyText="There is no knowledge base"
          emptyImage="/images/actions/18.svg"
        />
      </Sidebar>
    );
  }
}

export default KnowledgeList;
