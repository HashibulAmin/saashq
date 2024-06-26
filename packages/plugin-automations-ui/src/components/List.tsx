import Button from '@saashq/ui/src/components/Button';
import DataWithLoader from '@saashq/ui/src/components/DataWithLoader';
import FormControl from '@saashq/ui/src/components/form/Control';
import Pagination from '@saashq/ui/src/components/pagination/Pagination';
import Table from '@saashq/ui/src/components/table';
import withTableWrapper from '@saashq/ui/src/components/table/withTableWrapper';
import { __, router } from 'coreui/utils';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import { BarItems } from '@saashq/ui/src/layout/styles';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from '@saashq/ui/src/types';
import { IAutomation, AutomationsCount } from '../types';
import Row from './Row';
import { EmptyContent } from '../styles';
import Sidebar from './Sidebar';
import { isEnabled } from '@saashq/ui/src/utils/core';
import TaggerPopover from '@saashq/ui-tags/src/components/TaggerPopover';
import { TAG_TYPES } from '@saashq/ui-tags/src/constants';

interface IProps extends IRouterProps {
  automations: IAutomation[];
  loading: boolean;
  searchValue: string;
  totalCount: number;
  toggleBulk: () => void;
  toggleAll: (targets: IAutomation[], containerId: string) => void;
  bulk: any[];
  isAllSelected: boolean;
  emptyBulk: () => void;
  addAutomation: () => void;
  removeAutomations: (
    doc: { automationIds: string[] },
    emptyBulk: () => void,
  ) => void;
  archiveAutomations: (
    doc: { automationIds: string[]; isRestore?: boolean },
    emptyBulk: () => void,
  ) => void;
  queryParams: any;
  exportAutomations: (bulk: string[]) => void;
  duplicate: (_id: string) => void;
  refetch?: () => void;
  renderExpandButton?: any;
  isExpand?: boolean;
  counts: AutomationsCount;
}

type State = {
  searchValue?: string;
};

class AutomationsList extends React.Component<IProps, State> {
  private timer?: NodeJS.Timer = undefined;

  constructor(props) {
    super(props);

    this.state = {
      searchValue: this.props.searchValue,
    };
  }

  onChange = () => {
    const { toggleAll, automations } = this.props;

    toggleAll(automations, 'automations');
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

  removeAutomations = (automations) => {
    const automationIds: string[] = [];

    automations.forEach((automation) => {
      automationIds.push(automation._id);
    });

    this.props.removeAutomations({ automationIds }, this.props.emptyBulk);
  };

  archiveAutomations = (automations) => {
    const automationIds: string[] = automations.map(
      (automation) => automation._id,
    );

    const isRestore = this.props?.queryParams?.status === 'archived';

    this.props.archiveAutomations(
      { automationIds, isRestore },
      this.props.emptyBulk,
    );
  };

  moveCursorAtTheEnd = (e) => {
    const tmpValue = e.target.value;
    e.target.value = '';
    e.target.value = tmpValue;
  };

  afterTag = () => {
    this.props.emptyBulk();

    if (this.props.refetch) {
      this.props.refetch();
    }
  };

  render() {
    const {
      history,
      loading,
      toggleBulk,
      duplicate,
      bulk,
      isAllSelected,
      totalCount,
      queryParams,
      isExpand,
      counts,
      addAutomation,
      emptyBulk,
    } = this.props;

    const automations = this.props.automations || [];

    const mainContent = (
      <withTableWrapper.Wrapper>
        <Table whiteSpace="nowrap" bordered={true} hover={true}>
          <thead>
            <tr>
              <th>
                <FormControl
                  checked={isAllSelected}
                  componentClass="checkbox"
                  onChange={this.onChange}
                />
              </th>
              <th>{__('Název')}</th>
              <th>{__('Postavení')}</th>
              <th>{__('Spouštěče')}</th>
              <th>{__('Akce')}</th>
              {isEnabled('tags') && <th>{__('Tagy')}</th>}
              <th>{__('Naposledy aktualizováno uživatelem')}</th>
              <th>{__('Vytvořil')}</th>
              <th>{__('Poslední aktualizace')}</th>
              <th>{__('Datum vytvoření')}</th>
              <th>{__('Akce')}</th>
            </tr>
          </thead>
          <tbody id="automations" className={isExpand ? 'expand' : ''}>
            {(automations || []).map((automation) => (
              <Row
                key={automation._id}
                automation={automation}
                isChecked={bulk.includes(automation)}
                history={history}
                removeAutomations={this.removeAutomations}
                toggleBulk={toggleBulk}
                duplicate={duplicate}
              />
            ))}
          </tbody>
        </Table>
      </withTableWrapper.Wrapper>
    );

    let actionBarLeft: React.ReactNode;

    if (bulk.length > 0) {
      actionBarLeft = (
        <BarItems>
          <Button
            btnStyle="danger"
            size="small"
            icon="cancel-1"
            onClick={() => this.removeAutomations(bulk)}
          >
            Odstranit
          </Button>
          <Button
            btnStyle="simple"
            size="small"
            icon="archive-alt"
            onClick={() => this.archiveAutomations(bulk)}
          >
            {queryParams.status === 'archived' ? 'Restore' : 'Archive'}
          </Button>
          {isEnabled('tags') && (
            <TaggerPopover
              type={TAG_TYPES.AUTOMATION}
              successCallback={emptyBulk}
              singleSelect
              targets={bulk}
              trigger={
                <Button btnStyle="simple" size="small" icon="tag-alt">
                  Štítek
                </Button>
              }
            />
          )}
        </BarItems>
      );
    }

    const actionBarRight = (
      <BarItems>
        <FormControl
          type="text"
          placeholder={__('Hledejte automatizaci')}
          onChange={this.search}
          value={this.state.searchValue}
          autoFocus={true}
          onFocus={this.moveCursorAtTheEnd}
        />

        <Button
          btnStyle="success"
          size="small"
          icon="plus-circle"
          onClick={addAutomation}
        >
          {__('Vytvořte automatizaci')}
        </Button>
      </BarItems>
    );

    const actionBar = (
      <Wrapper.ActionBar right={actionBarRight} left={actionBarLeft} />
    );

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__('Automatizace')}
            breadcrumb={[{ title: __('Automatizace') }]}
            queryParams={queryParams}
          />
        }
        actionBar={actionBar}
        leftSidebar={
          <Sidebar
            counts={counts || ({} as any)}
            history={history}
            queryParams={queryParams}
          />
        }
        footer={<Pagination count={totalCount} />}
        content={
          <DataWithLoader
            data={mainContent}
            loading={loading}
            count={(automations || []).length}
            emptyContent={
              <EmptyContent>
                <img src="/images/actions/automation.svg" alt="empty-img" />

                <p>
                  <b>{__('Zatím nemáte žádné automatizace')}.</b>
                  {__(
                    'Automaticky provádějte opakující se úkoly a ujistěte se, že nic nepropadne',
                  )}
                  .
                </p>
              </EmptyContent>
            }
          />
        }
        hasBorder
      />
    );
  }
}

export default withTableWrapper(
  'Automatizace',
  withRouter<IRouterProps, any>(AutomationsList),
);
