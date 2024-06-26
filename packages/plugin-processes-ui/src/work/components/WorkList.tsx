import DataWithLoader from '@saashq/ui/src/components/DataWithLoader';
import Form from '../containers/WorkForm';
import FormControl from '@saashq/ui/src/components/form/Control';
import Pagination from '@saashq/ui/src/components/pagination/Pagination';
import React from 'react';
import Row from './WorkRow';
import Table from '@saashq/ui/src/components/table';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import { router } from '@saashq/ui/src/utils';
import { __ } from 'coreui/utils';
import { BarItems } from '@saashq/ui/src/layout/styles';
import { Count } from '@saashq/ui/src/styles/main';
import { IRouterProps } from '@saashq/ui/src/types';
import { IWorkDocument } from '../types';
import { menuNavs } from '../../constants';
import Sidebar from './WorkSidebar';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import Button from '@saashq/ui/src/components/Button';

interface IProps extends IRouterProps {
  history: any;
  queryParams: any;
  works: IWorkDocument[];
  worksCount: number;
  loading: boolean;
  searchValue: string;
  removeWork: (id: string) => void;
}

type State = {
  searchValue?: string;
};

class List extends React.Component<IProps, State> {
  private timer?: NodeJS.Timer;

  constructor(props) {
    super(props);

    this.state = {
      searchValue: this.props.searchValue,
    };
  }

  renderRow = () => {
    const { works, history, removeWork } = this.props;
    return works.map((work) => (
      <Row
        history={history}
        key={work._id}
        work={work}
        removeWork={removeWork}
      />
    ));
  };

  renderCount = (worksCount) => {
    return (
      <Count>
        {worksCount} work{worksCount > 1 && 's'}
      </Count>
    );
  };

  search = (e) => {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    const { history } = this.props;
    const searchValue = e.target.value;

    this.setState({ searchValue });

    this.timer = setTimeout(() => {
      router.removeParams(history, 'page');
      router.setParams(history, { searchValue });
    }, 500);
  };

  moveCursorAtTheEnd(e) {
    const tmpValue = e.target.value;

    e.target.value = '';
    e.target.value = tmpValue;
  }

  render() {
    const { worksCount, loading, queryParams, history } = this.props;

    const trigger = (
      <Button btnStyle="success" icon="plus-circle">
        {__('Add work')}
      </Button>
    );

    const modalContent = (props) => <Form {...props} />;

    const actionBarRight = (
      <BarItems>
        <FormControl
          type="text"
          placeholder={__('Zadejte a vyhledejte')}
          onChange={this.search}
          value={this.state.searchValue}
          autoFocus={true}
          onFocus={this.moveCursorAtTheEnd}
        />
        <ModalTrigger
          title="Add Work"
          size="xl"
          trigger={trigger}
          autoOpenKey="showProductModal"
          content={modalContent}
        />
      </BarItems>
    );

    const content = (
      <>
        {this.renderCount(worksCount || 0)}
        <Table hover={true}>
          <thead>
            <tr>
              <th>{__('Název')}</th>
              <th>{__('Postavení')}</th>
              <th>{__('Flow')}</th>
              <th>{__('Count')}</th>
              <th>{__('Spend Branch')}</th>
              <th>{__('Spend Department')}</th>
              <th>{__('Receipt Branch')}</th>
              <th>{__('Receipt Department')}</th>
              <th>{__('Need products')}</th>
              <th>{__('Result products')}</th>
              <th>{__('Due Date')}</th>
              <th>{__('Akce')}</th>
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
        leftSidebar={<Sidebar queryParams={queryParams} history={history} />}
        footer={<Pagination count={worksCount || 0} />}
        content={
          <DataWithLoader
            data={content}
            loading={loading}
            count={worksCount}
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
