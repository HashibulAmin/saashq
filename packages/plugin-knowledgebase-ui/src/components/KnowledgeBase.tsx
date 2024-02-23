import ArticleForm from '../containers/article/ArticleForm';
import ArticleList from '../containers/article/ArticleList';
import Button from '@saashq/ui/src/components/Button';
import { ICategory } from '@saashq/ui-knowledgeBase/src/types';
import KnowledgeList from '../containers/knowledge/KnowledgeList';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import Pagination from '@saashq/ui/src/components/pagination/Pagination';
import React from 'react';
import { Title } from '@saashq/ui/src/styles/main';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import { __ } from '@saashq/ui/src/utils/core';

type Props = {
  queryParams: any;
  articlesCount: number;
  currentCategory: ICategory;
};

class KnowledgeBase extends React.Component<Props> {
  breadcrumb() {
    const currentCategory =
      this.props.currentCategory ||
      ({
        title: '',
        firstTopic: { title: '' }
      } as ICategory);
    const currentKnowledgeBase = currentCategory.firstTopic || { title: '' };
    const list = [{ title: __('Knowledge Base'), link: '/knowledgeBase' }];
    const categoryLink = `/knowledgeBase?id=${currentCategory._id}`;

    if (currentKnowledgeBase.title) {
      list.push({
        title: currentKnowledgeBase.title,
        link: currentCategory ? categoryLink : ''
      });
    }

    if (currentCategory.title) {
      list.push({
        title: currentCategory.title,
        link: categoryLink
      });
    }

    return list;
  }

  render() {
    const { articlesCount, queryParams, currentCategory } = this.props;

    const trigger = (
      <Button btnStyle="primary" icon="plus-circle">
        Add Article
      </Button>
    );

    const content = props => (
      <ArticleForm
        {...props}
        queryParams={queryParams}
        currentCategoryId={currentCategory._id}
        topicId={currentCategory.firstTopic && currentCategory.firstTopic._id}
      />
    );

    const actionBarLeft = currentCategory._id && (
      <ModalTrigger
        title="Add Article"
        trigger={trigger}
        size="lg"
        autoOpenKey="showKBAddArticleModal"
        content={content}
        enforceFocus={false}
      />
    );

    const leftActionBar = (
      <Title>
        {currentCategory.title}
        <span>
          ({articlesCount} {articlesCount > 1 ? __('articles') : __('article')})
        </span>
      </Title>
    );

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={`${currentCategory.title || ''}`}
            breadcrumb={this.breadcrumb()}
          />
        }
        leftSidebar={
          <KnowledgeList
            currentCategoryId={currentCategory._id}
            articlesCount={articlesCount}
            queryParams={queryParams}
          />
        }
        actionBar={
          <Wrapper.ActionBar left={leftActionBar} right={actionBarLeft} />
        }
        footer={currentCategory._id && <Pagination count={articlesCount} />}
        transparent={true}
        content={
          <ArticleList
            queryParams={queryParams}
            currentCategoryId={currentCategory._id}
            topicId={
              currentCategory.firstTopic && currentCategory.firstTopic._id
            }
          />
        }
        hasBorder={true}
      />
    );
  }
}

export default KnowledgeBase;
