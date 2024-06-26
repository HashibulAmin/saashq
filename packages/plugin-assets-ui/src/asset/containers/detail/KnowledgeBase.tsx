import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { IArticle, ICategory } from '@saashq/ui-knowledgebase/src/types';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import Spinner from '@saashq/ui/src/components/Spinner';
import { QueryResponse } from '@saashq/ui/src/types';
import { withProps } from '@saashq/ui/src/utils';
import * as compose from 'lodash.flowright';
import React from 'react';
import AssetKb from '../../components/detail/KnowledgeBase';
import { queries } from '../../graphql';
import { IAsset } from '../../../common/types';

type Props = {
  kbArticleIds: string[];
  asset: IAsset;
};

type FinalProps = {
  kbArticlesQueryResponse: {
    knowledgeBaseArticles: IArticle[];
  } & QueryResponse;
} & Props;

const KbContainer = (props: FinalProps) => {
  const { kbArticlesQueryResponse, kbArticleIds, asset } = props;
  const { loading, error, knowledgeBaseArticles } =
    kbArticlesQueryResponse || {};

  if (loading) {
    return <Spinner objective={true} />;
  }

  if (!knowledgeBaseArticles || error) {
    return <EmptyState text="Nenalezeno" image="/images/actions/24.svg" />;
  }

  const articles = knowledgeBaseArticles || ([{}] as IArticle[]);

  const updatedProps = {
    kbArticleIds,
    articles,
    asset,
  };

  return <AssetKb {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.knowledgeBaseArticles), {
      name: 'kbArticlesQueryResponse',
      options: ({ kbArticleIds }) => ({
        variables: {
          articleIds: kbArticleIds,
        },
      }),
    }),
  )(KbContainer),
);
