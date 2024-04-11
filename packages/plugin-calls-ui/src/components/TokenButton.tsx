import { Button, Icon, Tip } from '@saashq/ui/src/components';
import { __ } from '@saashq/ui/src/utils/core';
import React from 'react';
import Alert from '@saashq/ui/src/utils/Alert';

type Props = {
  integration: any;
};

const TokenButton = (props: Props) => {
  if (!props.integration || props.integration.kind !== 'calls') {
    return null;
  }

  return (
    <Button
      btnStyle="link"
      onClick={() => {
        if (!props.integration.data || !props.integration.data.token) {
          return Alert.error('Nebyl nalezen žádný token');
        }

        navigator.clipboard.writeText(props.integration.data.token);

        Alert.success('Token zkopírován do schránky');
      }}
    >
      <Tip text={__('Copy token')} placement="top">
        <Icon icon="copy" />
      </Tip>
    </Button>
  );
};

export default TokenButton;
