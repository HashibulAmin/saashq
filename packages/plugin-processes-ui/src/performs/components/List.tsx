import Button from '@saashq/ui/src/components/Button';
import DataWithLoader from '@saashq/ui/src/components/DataWithLoader';
import Form from '../containers/Form';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import Pagination from '@saashq/ui/src/components/pagination/Pagination';
import PerformSidebar from './Sidebar';
import React from 'react';
import Row from './Row';
import Table from '@saashq/ui/src/components/table';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import { __ } from 'coreui/utils';
import {
  BarItems,
  FieldStyle,
  SidebarCounter,
} from '@saashq/ui/src/layout/styles';
import { Count } from '@saashq/ui/src/styles/main';
import { IPerform } from '../types';
import { IRouterProps } from '@saashq/ui/src/types';
import { menuNavs } from '../../constants';

interface IProps extends IRouterProps {
  history: any;
  queryParams: any;
  performs: IPerform[];
  performsCount: number;
  loading: boolean;
  removePerform: (_id: string) => void;
}

type State = {
  overallWorkPercent: number;
};

class List extends React.Component<IProps, State> {
  constructor(props) {
    super(props);

    this.state = {
      overallWorkPercent: 0,
    };
  }

  renderView = (name: string, variable: string) => {
    const defaultName = '-';

    return (
      <li>
        <FieldStyle>{__(name)}</FieldStyle>
        <SidebarCounter>{variable || defaultName}</SidebarCounter>
      </li>
    );
  };

  renderProducts = (name: string, products: any[]) => {
    const result: React.ReactNode[] = [];

    result.push(
      <li>
        <FieldStyle>{__(name)}</FieldStyle>
        <SidebarCounter>{(products || []).length}</SidebarCounter>
      </li>,
    );

    for (const product of products) {
      const { quantity, uom } = product;
      const productName = product.product ? product.product.name : 'not name';

      result.push(this.renderView(productName, quantity + '/' + uom + '/'));
    }

    return result;
  };

  renderRow = () => {
    const { performs, history, removePerform } = this.props;
    return (performs || []).map((perform) => (
      <Row
        history={history}
        key={perform._id}
        perform={perform}
        removePerform={removePerform}
      />
    ));
  };

  renderCount = (performsCount) => {
    return (
      <Count>
        {performsCount} performance{performsCount > 1 && 's'}
      </Count>
    );
  };

  render() {
    const { performsCount, loading, queryParams, history } = this.props;

    const trigger = (
      <Button btnStyle="success" icon="plus-circle">
        {__('Add performance')}
      </Button>
    );

    const modalContent = (props) => <Form {...props} />;

    const actionBarRight = (
      <BarItems>
        <ModalTrigger
          title={__('Add Performance')}
          size="xl"
          trigger={trigger}
          autoOpenKey="showProductModalz"
          content={modalContent}
        />
      </BarItems>
    );

    const content = (
      <>
        {this.renderCount(performsCount || 0)}
        <Table hover={true}>
          <thead>
            <tr>
              <th>{__('Work')}</th>
              <th>{__('Typ')}</th>
              <th>{__('StartAt')}</th>
              <th>{__('EndAt')}</th>
              <th>{__('Count')}</th>
              <th>{__('Popis')}</th>
              <th>{__('Spend products')}</th>
              <th>{__('Receipt products')}</th>
              <th>{__('Spend Branch')}</th>
              <th>{__('Spend Department')}</th>
              <th>{__('Receipt Branch')}</th>
              <th>{__('Receipt Department')}</th>

              <th>{__('Postavení')}</th>
            </tr>
          </thead>
          <tbody>{this.renderRow()}</tbody>
        </Table>
      </>
    );

    return (
      <Wrapper
        header={<Wrapper.Header title={__('Work')} submenu={menuNavs} />}
        actionBar={<Wrapper.ActionBar right={actionBarRight} />}
        leftSidebar={
          <PerformSidebar queryParams={queryParams} history={history} />
        }
        footer={<Pagination count={performsCount || 0} />}
        content={
          <DataWithLoader
            data={content}
            loading={loading}
            count={performsCount || 0}
            emptyText="Nejsou žádná data"
            emptyImage="/images/actions/5.svg"
          />
        }
        hasBorder={true}
        transparent={true}
      />
    );
  }
}

export default List;
