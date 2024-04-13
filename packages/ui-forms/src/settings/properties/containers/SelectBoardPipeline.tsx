import * as compose from 'lodash.flowright';

import { graphql, ChildProps } from '@apollo/client/react/hoc';

import { BoardsQueryResponse } from '@saashq/ui-cards/src/boards/types';
import ButtonMutate from '@saashq/ui/src/components/ButtonMutate';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import React from 'react';
import SelectBoards from '../components/SelectBoardPipeline';
import Spinner from '@saashq/ui/src/components/Spinner';
import { gql } from '@apollo/client';
import { mutations } from '@saashq/ui-cards/src/settings/boards/graphql';
import { queries } from '@saashq/ui-cards/src/boards/graphql';
import { withProps } from '@saashq/ui/src/utils';

type Props = {
  onChangeItems: (items: any) => any;
  selectedItems: any[];
  isRequired?: boolean;
  description?: string;
  type: string;
};

type FinalProps = {
  boardsQuery: BoardsQueryResponse;
} & Props;

const SelectContainer = (props: ChildProps<FinalProps>) => {
  const { boardsQuery } = props;

  const boards = boardsQuery.boards || [];

  if (boardsQuery.loading) {
    return <Spinner objective={true} />;
  }

  const renderButton = ({
    name,
    values,
    isSubmitted,
    callback,
  }: IButtonMutateProps) => {
    const callBackResponse = () => {
      boardsQuery.refetch();

      if (callback) {
        callback();
      }
    };

    return (
      <ButtonMutate
        mutation={mutations.boardAdd}
        variables={values}
        callback={callBackResponse}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`Úspěšně jste přidali a ${name}`}
      />
    );
  };

  const updatedProps = {
    ...props,
    boards,
    items: [],
    renderButton,
  };

  return <SelectBoards {...updatedProps} />;
};

const getRefetchQueries = () => {
  return [
    {
      query: gql(queries.boards),
      variables: {},
    },
  ];
};

export default withProps<Props>(
  compose(
    graphql<Props, BoardsQueryResponse, { type: string }>(gql(queries.boards), {
      name: 'boardsQuery',
      options: ({ type }) => ({
        variables: {
          type,
        },
        refetchQueries: getRefetchQueries,
      }),
    }),
  )(SelectContainer),
);
