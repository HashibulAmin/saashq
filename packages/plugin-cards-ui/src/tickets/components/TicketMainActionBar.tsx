import { IBoard } from '@saashq/ui-cards/src/boards/types';
import { INTEGRATION_KINDS } from '@saashq/ui/src/constants/integrations';
import { IOption } from '@saashq/ui/src/types';
import MainActionBar from '@saashq/ui-cards/src/boards/components/MainActionBar';
import React from 'react';
import Select from 'react-select-plus';
import SelectCompanies from '@saashq/ui-contacts/src/companies/containers/SelectCompanies';
import SelectCustomers from '@saashq/ui-contacts/src/customers/containers/SelectCustomers';
import { __ } from 'coreui/utils';
import { getBoardViewType } from '@saashq/ui-cards/src/boards/utils';
import { isEnabled } from '@saashq/ui/src/utils/core';
import options from '@saashq/ui-cards/src/tickets/options';

type Props = {
  onSearch: (search: string) => void;
  onSelect: (values: string[] | string, name: string) => void;
  onDateFilterSelect: (name: string, value: string) => void;
  onClear: (name: string, values) => void;
  isFiltered: () => boolean;
  clearFilter: () => void;
  boards: IBoard[];
  middleContent?: () => React.ReactNode;
  history: any;
  queryParams: any;
};

const TicketMainActionBar = (props: Props) => {
  const { queryParams, onSelect } = props;

  const viewType = getBoardViewType();

  const sourceValues = INTEGRATION_KINDS.ALL.map((kind) => ({
    label: kind.text,
    value: kind.value,
  }));

  sourceValues.push({
    label: 'Other',
    value: 'other',
  });

  const sources = queryParams ? queryParams.source : [];
  const onSourceSelect = (ops: IOption[]) =>
    onSelect(
      ops.map((option) => option.value),
      'source',
    );

  const extraFilter = (
    <>
      <Select
        placeholder={__('Choose a source')}
        value={sources}
        options={sourceValues}
        name="source"
        onChange={onSourceSelect}
        multi={true}
        loadingPlaceholder={__('Načítání...')}
      />

      {isEnabled('contacts') && (
        <>
          <SelectCompanies
            label="Choose companies"
            name="companyIds"
            queryParams={queryParams}
            onSelect={onSelect}
          />

          <SelectCustomers
            label="Choose customers"
            name="customerIds"
            queryParams={queryParams}
            onSelect={onSelect}
          />
        </>
      )}
    </>
  );

  const extendedProps = {
    ...props,
    options,
    extraFilter,
    link: `/ticket/${viewType}`,
  };

  return <MainActionBar viewType={viewType} {...extendedProps} />;
};

export default TicketMainActionBar;
