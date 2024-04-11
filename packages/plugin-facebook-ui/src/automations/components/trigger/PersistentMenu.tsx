import React from 'react';
import * as compose from 'lodash.flowright';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { queries } from '../../bots/graphql';
import { withProps } from '@saashq/ui/src/utils/core';
import { QueryResponse } from '@saashq/ui/src/types';
import FormControl from '@saashq/ui/src/components/form/Control';
import Spinner from '@saashq/ui/src/components/Spinner';
import { ListItem } from '../../styles';
import colors from '@saashq/ui/src/styles/colors';
import EmptyState from '@saashq/ui/src/components/EmptyState';

type Props = {
  botId?: string;
  onChange: (name: string, value: any) => void;
  persistentMenuIds?: string[];
  displaySelectedContent?: boolean;
};

type FinalProps = {
  botQueryResponse: { facebootMessengerBot: any } & QueryResponse;
} & Props;

const renderSelectedMenus = (persistentMenus: any[], ids: string[]) => {
  return (
    <span style={{ color: colors.colorPrimary }}>
      {persistentMenus
        .filter((menu) => ids.includes(menu._id))
        .map((persistentMenu) => persistentMenu.text)
        .join(',')}
    </span>
  );
};

function PersistentMenuSelector({
  botQueryResponse,
  persistentMenuIds = [],
  onChange,
  displaySelectedContent,
}: FinalProps) {
  const { facebootMessengerBot, loading } = botQueryResponse || {};

  if (loading) {
    return <Spinner objective />;
  }

  const { persistentMenus = [] } = facebootMessengerBot || {};

  if (displaySelectedContent) {
    return renderSelectedMenus(persistentMenus, persistentMenuIds);
  }

  const onCheck = (_id) => {
    const updatedMenuIds = persistentMenuIds.includes(_id)
      ? persistentMenuIds.filter((id) => id !== _id)
      : [...persistentMenuIds, _id];

    onChange('persistentMenuIds', updatedMenuIds);
  };

  if (persistentMenus.length) {
    return (
      <EmptyState
        text="Žádné trvalé nabídky ve vybraném robotu"
        icon="list-ul"
        extra="Trvalá nabídka s odkazem se v sekci nemůže zobrazit jako volitelná podmínka"
      />
    );
  }

  return persistentMenus.map(
    ({ _id, text, type }) =>
      type !== 'link' && (
        <ListItem key={_id}>
          <FormControl
            componentClass="radio"
            color={colors.colorCoreBlue}
            checked={persistentMenuIds?.includes(_id)}
            onClick={() => onCheck(_id)}
          />
          <span>{text}</span>
        </ListItem>
      ),
  );
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.detail), {
      name: 'botQueryResponse',
      options: ({ botId }) => ({
        variables: { _id: botId },
      }),
      skip: ({ botId }) => !botId,
    }),
  )(PersistentMenuSelector),
);
