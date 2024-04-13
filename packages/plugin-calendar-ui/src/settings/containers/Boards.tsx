import { gql } from '@apollo/client';
import * as compose from 'lodash.flowright';
import ButtonMutate from '@saashq/ui/src/components/ButtonMutate';
import { IButtonMutateProps, IRouterProps } from '@saashq/ui/src/types';
import { Alert, confirm, withProps } from '@saashq/ui/src/utils';
import * as routerUtils from '@saashq/ui/src/utils/router';
import React from 'react';
import { graphql } from '@apollo/client/react/hoc';
import { withRouter } from 'react-router-dom';
import { getWarningMessage } from '@saashq/ui-cards/src/boards/utils';
import Boards from '../components/Boards';
import { mutations, queries } from '../graphql';
import { BoardsQueryResponse, RemoveBoardMutationResponse } from '../types';

type Props = {
  history?: any;
  currentBoardId: string;
};

type FinalProps = {
  boardsQuery: BoardsQueryResponse;
} & Props &
  IRouterProps &
  RemoveBoardMutationResponse;

class BoardsContainer extends React.Component<FinalProps> {
  render() {
    const { history, boardsQuery, removeMutation } = this.props;

    const boards = boardsQuery.calendarBoards || [];

    const removeHash = () => {
      const { location } = history;

      if (location.hash.includes('showBoardModal')) {
        routerUtils.removeHash(history, 'showBoardModal');
      }
    };

    // remove action
    const remove = (boardId) => {
      confirm(getWarningMessage('Deska'), { hasDeleteConfirm: true }).then(
        () => {
          removeMutation({
            variables: { _id: boardId },
            refetchQueries: getRefetchQueries(),
          })
            .then(() => {
              Alert.success('Úspěšně jste smazali nástěnku');
            })
            .catch((error) => {
              Alert.error(error.message);
            });
        },
      );
    };

    const renderButton = ({
      name,
      values,
      isSubmitted,
      callback,
      object,
    }: IButtonMutateProps) => {
      return (
        <ButtonMutate
          mutation={object ? mutations.boardEdit : mutations.boardAdd}
          variables={values}
          callback={callback}
          refetchQueries={getRefetchQueries()}
          isSubmitted={isSubmitted}
          type="submit"
          beforeSubmit={removeHash}
          successMessage={`Ty úspěšně ${
            object ? 'aktualizováno' : 'přidal'
          } A ${name}`}
        />
      );
    };

    const extendedProps = {
      ...this.props,
      boards,
      renderButton,
      remove,
      removeHash,
      loading: boardsQuery.loading,
    };

    return <Boards {...extendedProps} />;
  }
}

const getRefetchQueries = () => {
  return ['calendarBoards', 'calendarBoardGetLast'];
};

const generateOptions = () => ({
  refetchQueries: getRefetchQueries(),
});

export default withProps<Props>(
  compose(
    graphql<Props, BoardsQueryResponse, {}>(gql(queries.boards), {
      name: 'boardsQuery',
      options: () => ({
        variables: {},
      }),
    }),
    graphql<Props, RemoveBoardMutationResponse, {}>(
      gql(mutations.boardRemove),
      {
        name: 'removeMutation',
        options: generateOptions(),
      },
    ),
  )(withRouter<FinalProps, any>(BoardsContainer)),
);
