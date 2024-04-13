import Button from '@saashq/ui/src/components/Button';
import DataWithLoader from '@saashq/ui/src/components/DataWithLoader';
import PackageForm from './PackageForm';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import React from 'react';
import Row from './Row';
import Table from '@saashq/ui/src/components/table';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import { __ } from 'coreui/utils';
import { IPackage } from '../types';

type Props = {
  packages: IPackage[];
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  remove: (item: IPackage) => void;
  loading: boolean;
};

function List({ packages, remove, loading, renderButton }: Props) {
  const trigger = (
    <Button id={'AddPackage'} btnStyle="success" icon="plus-circle">
      Přidat balíček
    </Button>
  );

  const modalContent = (props) => (
    <PackageForm {...props} renderButton={renderButton} />
  );

  const actionBarRight = (
    <ModalTrigger
      title={__('Přidat balíček')}
      autoOpenKey={`showModal`}
      trigger={trigger}
      content={modalContent}
      enforceFocus={false}
    />
  );

  const actionBar = (
    <Wrapper.ActionBar
      left={'Balíčky'}
      right={actionBarRight}
      wideSpacing={true}
    />
  );

  const content = (
    <Table>
      <thead>
        <tr>
          <th>{__('Název')}</th>
          <th>{__('Popis')}</th>
          <th>{__('Akce')}</th>
        </tr>
      </thead>
      <tbody id={'TagsShowing'}>
        {packages.map((item) => {
          return (
            <Row
              key={item._id}
              item={item}
              removeItem={remove}
              renderButton={renderButton}
            />
          );
        })}
      </tbody>
    </Table>
  );

  return (
    <Wrapper
      header={<Wrapper.Header title={'Balíčky'} />}
      actionBar={actionBar}
      content={
        <DataWithLoader
          data={content}
          loading={loading}
          count={packages.length}
          emptyText={__('Není tam žádný štítek') + '.'}
          emptyImage="/images/actions/8.svg"
        />
      }
      transparent={true}
      hasBorder={true}
    />
  );
}

export default List;
