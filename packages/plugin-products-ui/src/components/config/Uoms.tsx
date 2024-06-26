import {
  Button,
  DataWithLoader,
  EmptyState,
  HeaderDescription,
  ModalTrigger,
  Pagination,
  Table,
} from '@saashq/ui/src/components';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import Form from './UomsForm';
import { Wrapper } from '@saashq/ui/src/layout';
import { __ } from '@saashq/ui/src/utils';
import React from 'react';
import Sidebar from './Sidebar';
import { IUom } from '../../types';
import Row from './Row';
import { Title } from '@saashq/ui-settings/src/styles';

type Props = {
  uomsTotalCount: number;
  uoms: IUom[];
  loading: boolean;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  remove: (brandId: string) => void;
};

class Uoms extends React.Component<Props, {}> {
  renderContent() {
    const { uoms, renderButton, remove } = this.props;

    return (
      <>
        <Table>
          <thead>
            <tr>
              <th>{__('code')}</th>
              <th>{__('Název')}</th>
              <th>{__('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {uoms.map((uom) => {
              return (
                <Row
                  key={uom._id}
                  uom={uom}
                  renderButton={renderButton}
                  remove={remove}
                />
              );
            })}
          </tbody>
        </Table>
        <Pagination count={10} />
      </>
    );
  }

  render() {
    const { uomsTotalCount, loading } = this.props;
    const breadcrumb = [
      { title: __('Nastavení'), link: '/settings' },
      { title: __('Uoms'), link: '/settings/uoms-manage' },
    ];

    const addBrand = (
      <Button
        id={'NewUomButton'}
        btnStyle="success"
        block={true}
        icon="plus-circle"
      >
        Add Uom
      </Button>
    );

    const content = (props) => (
      <Form {...props} extended={true} renderButton={this.props.renderButton} />
    );

    const righActionBar = (
      <ModalTrigger
        size="lg"
        title="New Uom"
        autoOpenKey="showUomAddModal"
        trigger={addBrand}
        content={content}
      />
    );

    const leftActionBar = <Title>{`All Uoms (${uomsTotalCount})`}</Title>;

    return (
      <Wrapper
        header={<Wrapper.Header title={`Uom`} breadcrumb={breadcrumb} />}
        mainHead={
          <HeaderDescription
            icon="/images/actions/32.svg"
            title={'Uoms'}
            description={__('Add uoms ...')}
          />
        }
        actionBar={
          <Wrapper.ActionBar
            right={righActionBar}
            wideSpacing={true}
            left={leftActionBar}
          />
        }
        leftSidebar={<Sidebar />}
        content={
          <DataWithLoader
            data={this.renderContent()}
            loading={loading}
            count={uomsTotalCount}
            emptyText="Add an integration in this Uom"
            emptyImage="/images/actions/2.svg"
          />
        }
        footer={uomsTotalCount > 0 && <Pagination count={uomsTotalCount} />}
        hasBorder={true}
      />
    );
  }
}

export default Uoms;
