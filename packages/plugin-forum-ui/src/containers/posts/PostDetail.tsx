import React from 'react';
import { useMutation } from '@apollo/client';
import { queries, mutations } from '../../graphql';
import { gql } from '@apollo/client';
import { IPost, PostDetailQueryResponse } from '../../types';
import { withProps, confirm } from '@saashq/ui/src/utils';
import * as compose from 'lodash.flowright';
import { graphql } from '@apollo/client/react/hoc';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import Spinner from '@saashq/ui/src/components/Spinner';
import Detail from '../../components/posts/PostDetail';

type Props = {
  _id: string;
};

type FinalProps = {
  postDetailQuery: PostDetailQueryResponse;
} & Props;

function PostDetail(props: FinalProps) {
  const { postDetailQuery, _id } = props;

  const [mutDraft] = useMutation(gql(mutations.postDraft), {
    variables: { _id },
    refetchQueries: queries.postRefetchAfterEdit,
  });

  const [mutPublish] = useMutation(gql(mutations.postPublish), {
    variables: { _id },
    refetchQueries: queries.postRefetchAfterEdit,
  });

  const [mutApprove] = useMutation(gql(mutations.postApprove), {
    variables: { _id },
    refetchQueries: queries.postRefetchAfterEdit,
  });

  const [mutDeny] = useMutation(gql(mutations.postDeny), {
    variables: { _id },
    refetchQueries: queries.postRefetchAfterEdit,
  });

  const [mutSetFeatured] = useMutation(gql(mutations.featuredToggle), {
    refetchQueries: ['ForumPostDetail'],
  });

  if (postDetailQuery.loading) {
    return <Spinner objective={true} />;
  }

  if (!postDetailQuery.forumPost) {
    return (
      <EmptyState text="Příspěvek nenalezen" image="/images/actions/17.svg" />
    );
  }

  const onDraft = async () => {
    confirm('Opravdu chcete uložit jako koncept?').then(() => mutDraft());
  };

  const onPublish = async () => {
    confirm('Opravdu chcete publikovat?').then(() => mutPublish());
  };

  const onApproveClick = async () => {
    confirm('Opravdu chcete schválit tento příspěvek?').then(() =>
      mutApprove(),
    );
  };

  const onDenyClick = async () => {
    confirm('Opravdu chcete zamítnout tento příspěvek?').then(() => mutDeny());
  };

  const onFeature = (postId: string, forumPost: IPost) => {
    confirm(
      `Jsi si jistý, že chceš ${
        forumPost.isFeaturedByAdmin ? 'unfeature' : 'feature'
      } tento příspěvek?`,
    ).then(() =>
      mutSetFeatured({
        variables: {
          id: postId,
          featured: !forumPost.isFeaturedByAdmin,
        },
      }),
    );
  };

  const updatedProps = {
    ...props,
    post: postDetailQuery.forumPost || ({} as IPost),
    onDraft,
    onPublish,
    onApproveClick,
    onDenyClick,
    onFeature,
  };

  return <Detail {...updatedProps} />;
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.forumPostDetail), {
      name: 'postDetailQuery',
      options: ({ _id }) => ({
        variables: {
          _id,
        },
        fetchPolicy: 'network-only',
      }),
    }),
  )(PostDetail),
);
