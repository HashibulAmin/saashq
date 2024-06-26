import dayjs from 'dayjs';
import Icon from '@saashq/ui/src/components/Icon';
import React from 'react';
import { __ } from '@saashq/ui/src/utils';
import { ItemDate } from '../../styles/common';
import { IItem } from '../../types';
import { Footer, Right } from '../../styles/item';

const footerInfo = (item) => {
  if (!item.isWatched && !item.number) {
    return __('Vytvořeno v');
  }

  return (
    <>
      {item.isWatched && <Icon icon="eye" />}
      {item.number}
    </>
  );
};

const renderDate = (date) => {
  if (!date) {
    return null;
  }

  return <ItemDate>{dayjs(date).format('lll')}</ItemDate>;
};

const ItemFooter = (props: { item: IItem }) => {
  const { item } = props;
  return (
    <Footer>
      {footerInfo(item)}
      <Right>{renderDate(item.createdAt)}</Right>
    </Footer>
  );
};

export default ItemFooter;
