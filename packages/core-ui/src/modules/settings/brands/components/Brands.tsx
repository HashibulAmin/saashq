import BrandForm from '@saashq/ui/src/brands/components/BrandForm';
import Button from 'modules/common/components/Button';
import DataWithLoader from 'modules/common/components/DataWithLoader';
import EmptyState from 'modules/common/components/EmptyState';
import HeaderDescription from 'modules/common/components/HeaderDescription';
import { IBrand } from '../types';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import ModalTrigger from 'modules/common/components/ModalTrigger';
import Pagination from 'modules/common/components/pagination/Pagination';
import React from 'react';
import Sidebar from '../containers/Sidebar';
import Table from 'modules/common/components/table';
import { Title } from '@saashq/ui-settings/src/styles';
import Wrapper from '../../../layout/components/Wrapper';
import { __ } from '../../../common/utils';

type Props = {
  brandsTotalCount: number;
  queryParams: any;
  currentBrand: IBrand;
  loading: boolean;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

class Brands extends React.Component<Props, {}> {
  renderContent() {
    const { currentBrand, queryParams, renderButton } = this.props;

    if (!currentBrand._id) {
      return <EmptyState image="/images/actions/20.svg" text="Žádná značka." />;
    }

    return (
      <>
        <Table>
          <thead>
            <tr>
              <th>{__('Brand name')}</th>
              <th>{__('Popis')}</th>
              <th>{__('Akce')}</th>
            </tr>
          </thead>
          <tbody>
            <Sidebar
              currentBrandId={currentBrand._id}
              queryParams={queryParams}
              renderButton={renderButton}
            />
          </tbody>
        </Table>
        <Pagination count={10} />
      </>
    );
  }

  render() {
    const { brandsTotalCount, currentBrand, loading } = this.props;

    const breadcrumb = [
      { title: __('Settings'), link: '/settings' },
      { title: __('Brands'), link: '/settings/brands' },
      { title: `${currentBrand.name || ''}` },
    ];

    const addBrand = (
      <Button
        id={'NewBrandButton'}
        btnStyle="success"
        block={true}
        icon="plus-circle"
      >
        Přidat Novou Značku
      </Button>
    );

    const content = (props) => (
      <BrandForm
        {...props}
        extended={true}
        renderButton={this.props.renderButton}
      />
    );

    const leftActionBar = <Title>{currentBrand.name}</Title>;

    const righActionBar = (
      <ModalTrigger
        size="lg"
        title="New Brand"
        autoOpenKey="showBrandAddModal"
        trigger={addBrand}
        content={content}
      />
    );

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={`${currentBrand.name || ''}`}
            breadcrumb={breadcrumb}
          />
        }
        mainHead={
          <HeaderDescription
            icon="/images/actions/32.svg"
            title={'Značky'}
            description={__(
              'Přidejte neomezené množství značek s neomezenou podporou, abyste podpořili svůj růst a urychlili své podnikání',
            )}
          />
        }
        actionBar={
          <Wrapper.ActionBar left={leftActionBar} right={righActionBar} />
        }
        content={
          <DataWithLoader
            data={this.renderContent()}
            loading={loading}
            count={brandsTotalCount}
            emptyText="Neexistuje žádná značka."
            emptyImage="/images/actions/20.svg"
          />
        }
        footer={currentBrand._id && <Pagination count={brandsTotalCount} />}
        hasBorder={true}
      />
    );
  }
}

export default Brands;
