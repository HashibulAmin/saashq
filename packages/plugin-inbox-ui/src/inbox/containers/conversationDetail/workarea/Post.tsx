import * as compose from 'lodash.flowright';
import { IConversation, IMessage } from '@saashq/ui-inbox/src/inbox/types';
import Post from '../../../components/conversationDetail/workarea/Post';
import React from 'react';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { queries } from '@saashq/ui-inbox/src/inbox/graphql';
import { withProps } from '@saashq/ui/src/utils';
import Spinner from '@saashq/ui/src/components/Spinner';

type Props = {
  conversation: IConversation;
  conversationMessage: IMessage;
};

type FinalProps = {
  postQuery: any;
} & Props;

class PostInfoContainer extends React.Component<FinalProps> {
  render() {
    const { postQuery } = this.props;

    if (postQuery.loading) {
      return <Spinner />;
    }
    if (postQuery.facebookGetPost !== null) {
      const updatedProps = {
        ...this.props,
        PostInfo: postQuery.facebookGetPost || [],
      };

      return <Post {...updatedProps} />;
    } else {
      return null;
    }
  }
}

export default withProps<Props>(
  compose(
    graphql(gql(queries.postInfo), {
      name: 'postQuery',
      options: ({ conversation }: Props) => ({
        variables: { saashqApiId: conversation._id },
      }),
    }),
  )(PostInfoContainer),
);
