import Table from '@saashq/ui/src/components/table';
import { __ } from '@saashq/ui/src/utils';
import React from 'react';
import Row from './Row';

type Props = {
  list: any[];
  totalCount: number;
  remove: (_id: string) => void;
  repair: (_id: string) => void;
};

export default function List({ list, remove, repair }: Props) {
  return (
    <Table>
      <thead>
        <tr>
          <th>{__('Název')}</th>
          <th>{__('Account')}</th>
          <th>{__('Page')}</th>
          <th>{__('Akce')}</th>
        </tr>
      </thead>

      <tbody>
        {list.map((bot) => (
          <Row key={bot._id} bot={bot} remove={remove} repair={repair} />
        ))}
      </tbody>
    </Table>
  );
}
