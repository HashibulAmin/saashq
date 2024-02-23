import React, { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';

import { queries } from '../graphql';
import ErrorMsg from '@saashq/ui/src/components/ErrorMsg';
import Spinner from '@saashq/ui/src/components/Spinner';
import { isEnabled } from '@saashq/ui/src/utils/core';

import { IShq } from '../types';
import Appearance from '../components/Appearance';
import boardQueries from '@saashq/ui-cards/src/settings/boards/graphql/queries';
import client from '@saashq/ui/src/apolloClient';
import { IPipeline } from '@saashq/ui-cards/src/boards/types';

type Props = {
  shq: IShq;
  edit: (variables: IShq) => void;
};

export default function AppearanceContainer(props: Props) {
  const { shq } = props;

  const [pipelines, setPipelines] = useState<IPipeline[]>([] as IPipeline[]);

  const kbQuery = useQuery(gql(queries.knowledgeBaseTopics), {
    skip: !isEnabled('knowledgebase')
  });

  const boardsQuery = useQuery(gql(boardQueries.boards), {
    variables: { type: 'ticket' },
    skip: !isEnabled('cards')
  });

  const fetchPipelines = (boardId: string) => {
    client
      .query({
        query: gql(boardQueries.pipelines),
        variables: { boardId, type: 'ticket' }
      })
      .then(({ data = {} }) => {
        setPipelines(data.pipelines || []);
      });
  };

  useEffect(() => {
    if (shq.ticketBoardId) {
      fetchPipelines(shq.ticketBoardId);
    }
  }, [shq.ticketBoardId]);

  if (kbQuery.loading || boardsQuery.loading) {
    return <Spinner />;
  }

  if (kbQuery.error) {
    return <ErrorMsg>{kbQuery.error.message}</ErrorMsg>;
  }

  return (
    <Appearance
      {...props}
      kbTopics={
        kbQuery && kbQuery.data ? kbQuery.data.knowledgeBaseTopics || [] : []
      }
      boards={
        boardsQuery && boardsQuery.data ? boardsQuery.data.boards || [] : []
      }
      pipelines={pipelines}
      fetchPipelines={fetchPipelines}
    />
  );
}
