import { IConversation, IMessage } from '@saashq/ui-inbox/src/inbox/types';
import Button from '@saashq/ui/src/components/Button';
import Icon from '@saashq/ui/src/components/Icon';
import React from 'react';
import { __ } from '@saashq/ui/src/utils/core';
import styled from 'styled-components';

const Container = styled.div`
  display: inline-block;
`;

type Props = {
  conversation: IConversation;
  conversationMessage: IMessage;
  PostInfo: any;
};

export default function Post(props: Props) {
  const { PostInfo } = props;

  return (
    <Container>
      <Button size="small" btnStyle="simple">
        {__('Post Name : ' + PostInfo.content)} <Icon icon="angle" />
      </Button>

      <a href={PostInfo.permalink_url} target="_blank" rel="noreferrer">
        {__('go to post')}
      </a>
    </Container>
  );
}
