import * as compose from 'lodash.flowright';

import {
  AddMutationResponse,
  EmailTemplatesQueryResponse,
  IEngageMessageDoc,
} from '../types';
import { Alert, withProps } from '@saashq/ui/src/utils';
import {
  MESSAGE_KINDS,
  MESSENGER_KINDS,
  METHODS,
  SENT_AS_CHOICES,
} from '../constants';
import { mutations, queries } from '../graphql';

import { BrandsQueryResponse } from '@saashq/ui/src/brands/types';
import { ICustomer } from '@saashq/ui-contacts/src/customers/types';
import { IUser } from '@saashq/ui/src/auth/types';
import React from 'react';
import Widget from '../components/Widget';
import { crudMutationsOptions } from '../utils';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import withCurrentUser from '@saashq/ui/src/auth/containers/withCurrentUser';

type Props = {
  customers: ICustomer[];
  emptyBulk?: () => void;
  modalTrigger?: React.ReactNode;
  channelType?: string;
  totalCountQuery?: any;
  forceCreateConversation?: boolean;
};

type FinalProps = {
  currentUser: IUser;
  emailTemplatesQuery: EmailTemplatesQueryResponse;
  brandsQuery: BrandsQueryResponse;
} & Props &
  AddMutationResponse;

const WidgetContainer = (props: FinalProps) => {
  const {
    currentUser,
    emailTemplatesQuery,
    brandsQuery,
    emptyBulk,
    messagesAddMutation,
  } = props;

  if (emailTemplatesQuery.loading || brandsQuery.loading) {
    return null;
  }

  const emailTemplates = emailTemplatesQuery.emailTemplates;
  const brands = brandsQuery.brands;

  // save
  const save = (doc, callback) => {
    doc.kind = MESSAGE_KINDS.MANUAL;
    doc.isLive = true;
    doc.fromUserId = currentUser._id;
    doc.forceCreateConversation = props.forceCreateConversation;

    if (doc.method === METHODS.EMAIL && !doc.email.content) {
      return Alert.warning('Please fill in email content');
    }

    if (doc.method === METHODS.MESSENGER && !doc.messenger.content) {
      return Alert.warning('Please fill in message content');
    }

    messagesAddMutation({
      variables: doc,
    })
      .then(() => {
        callback();

        Alert.success(`Úspěšně jste přidali a engagement message`);

        if (emptyBulk) {
          emptyBulk();
        }
      })
      .catch((error) => {
        Alert.error(error.message);
      });
  };

  const updatedProps = {
    ...props,
    emailTemplates,
    brands,
    save,
    messengerKinds: MESSENGER_KINDS.SELECT_OPTIONS,
    sentAsChoices: SENT_AS_CHOICES.SELECT_OPTIONS,
  };

  return <Widget {...updatedProps} />;
};

const withQueries = withProps<Props>(
  compose(
    graphql<Props, EmailTemplatesQueryResponse>(gql(queries.emailTemplates), {
      name: 'emailTemplatesQuery',
      options: ({ totalCountQuery }) => ({
        variables: {
          perPage: totalCountQuery.emailTemplatesTotalCount,
        },
      }),
    }),
    graphql<Props, BrandsQueryResponse>(gql(queries.brands), {
      name: 'brandsQuery',
    }),
    graphql<Props, AddMutationResponse, IEngageMessageDoc>(
      gql(mutations.messagesAdd),
      {
        name: 'messagesAddMutation',
        options: crudMutationsOptions,
      },
    ),
  )(withCurrentUser(WidgetContainer)),
);

export default withProps<Props>(
  compose(
    graphql(gql(queries.totalCount), {
      name: 'totalCountQuery',
    }),
  )(withQueries),
);
