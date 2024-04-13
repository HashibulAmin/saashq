import SelectCompanies from '@saashq/ui-contacts/src/companies/containers/SelectCompanies';
import SelectCustomers from '@saashq/ui-contacts/src/customers/containers/SelectCustomers';
import {
  Box,
  Button,
  ControlLabel,
  DateControl,
  FormGroup as CommonFormGroup,
  Icon,
  router,
  Sidebar as CommonSideBar,
  Tip,
  Wrapper,
  __,
  FormControl,
} from '@saashq/ui/src';
import { DateContainer } from '@saashq/ui/src/styles/main';
import SelectBranches from '@saashq/ui/src/team/containers/SelectBranches';
import SelectDepartments from '@saashq/ui/src/team/containers/SelectDepartments';
import moment from 'moment';
import React from 'react';
import { SelectWithAssets } from '../../../common/utils';
import {
  ContainerBox,
  CustomRangeContainer,
  EndDateContainer,
} from '../../../style';

const { Section } = Wrapper.Sidebar;

type Props = {
  history: any;
  queryParams: any;
};

type State = {
  branchId?: string;
  departmentId?: string;
  teamMemberId?: string;
  companyId?: string;
  customerId?: string;
  assetId?: string;
  parentId?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
};

class Sidebar extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const { queryParams } = props;

    this.state = {
      ...queryParams,
    };
  }

  render() {
    const { queryParams } = this.props;

    const {
      branchId,
      departmentId,
      teamMemberId,
      companyId,
      customerId,
      assetId,
      parentId,
      createdAtFrom,
      createdAtTo,
    } = this.state;

    const clearParams = (field) => {
      if (Array.isArray(field)) {
        field.forEach((name) => {
          this.setState({ [name]: undefined });
          return router.removeParams(this.props.history, name);
        });
      }
      this.setState({ [field]: undefined });
      router.removeParams(this.props.history, field);
    };
    const FormGroup = ({
      label,
      field,
      clearable,
      children,
    }: {
      label: string;
      field: string | string[];
      clearable?: boolean;
      children: React.ReactNode;
    }) => {
      return (
        <CommonFormGroup>
          <ContainerBox row spaceBetween>
            <ControlLabel>{label}</ControlLabel>
            {clearable && (
              <Button btnStyle="link" onClick={() => clearParams(field)}>
                <Tip placement="bottom" text="Průhledná">
                  <Icon icon="cancel-1" />
                </Tip>
              </Button>
            )}
          </ContainerBox>
          {children}
        </CommonFormGroup>
      );
    };

    const handleSelect = (value, name) => {
      if (['createdAtFrom', 'createdAtTo'].includes(name)) {
        value = moment(value).format(`YYYY/MM/DD hh:mm`);
      }

      this.setState({ [name]: value });
      router.setParams(this.props.history, { [name]: value });
      router.setParams(this.props.history, { page: 1 });
    };

    const handleToggle = (value, name) => {
      value
        ? router.removeParams(this.props.history, name)
        : router.setParams(this.props.history, { [name]: !value });
    };

    const fields = [
      'branchId',
      'departmentId',
      'teamMemberId',
      'companyId',
      'customerId',
      'assetId',
      'createdAtFrom',
      'createdAtTo',
    ];

    const extraButton = (
      <Button btnStyle="link" onClick={() => clearParams(fields)}>
        <Tip text="Vymazat filtry" placement="bottom">
          <Icon icon="cancel-1" />
        </Tip>
      </Button>
    );

    return (
      <CommonSideBar>
        <Section.Title>
          {__('Sčítací Filtry')}
          <Section.QuickButtons>
            {fields.some((field) => queryParams[field]) && extraButton}
          </Section.QuickButtons>
        </Section.Title>
        <ContainerBox vertical column gap={5}>
          <FormGroup label="Větev" field="branchId" clearable={!!branchId}>
            <SelectBranches
              label="Vyberte Pobočku"
              name="branchId"
              multi={false}
              initialValue={branchId}
              onSelect={handleSelect}
              customOption={{ value: '', label: 'Vyberte Pobočku' }}
            />
          </FormGroup>
          <FormGroup
            label="Oddělení"
            field="departmentId"
            clearable={!!departmentId}
          >
            <SelectDepartments
              label="Vyberte Oddělení"
              name="departmentId"
              multi={false}
              initialValue={departmentId}
              onSelect={handleSelect}
              customOption={{ value: '', label: 'Vyberte Oddělení' }}
            />
          </FormGroup>
          <FormGroup
            label="Člen týmu"
            field="teamMemberId"
            clearable={!!teamMemberId}
          >
            <SelectCompanies
              label="Vyberte Člen týmu"
              name="teamMemberId"
              multi={false}
              initialValue={teamMemberId}
              onSelect={handleSelect}
              customOption={{ value: '', label: 'Vyberte Člen týmu' }}
            />
          </FormGroup>
          <FormGroup
            label="Společnost"
            field="companyId"
            clearable={!!companyId}
          >
            <SelectCompanies
              label="Vyberte Společnost"
              name="companyId"
              multi={false}
              initialValue={companyId}
              onSelect={handleSelect}
              customOption={{ value: '', label: 'Vyberte Společnost' }}
            />
          </FormGroup>
          <FormGroup
            label="Zákazník"
            field="customerId"
            clearable={!!customerId}
          >
            <SelectCustomers
              label="Vyberte Zákazník"
              name="customerId"
              multi={false}
              initialValue={customerId}
              onSelect={handleSelect}
              customOption={{ value: '', label: 'Vyberte Zákazník' }}
            />
          </FormGroup>
          <FormGroup label="Aktivum" field="assetId" clearable={!!assetId}>
            <SelectWithAssets
              label="Vyberte Aktivum"
              name="assetId"
              multi={false}
              initialValue={assetId}
              onSelect={handleSelect}
              customOption={{ value: '', label: 'Vyberte Aktivum' }}
            />
          </FormGroup>
          <FormGroup
            label="Nadřazená položka aktiv"
            field="parentId"
            clearable={!!parentId}
          >
            <SelectWithAssets
              label="Vyberte možnost Rodič"
              name="parentId"
              multi={false}
              initialValue={parentId}
              onSelect={handleSelect}
              customOption={{ value: '*', label: 'Bez rodiče' }}
            />
          </FormGroup>
          <FormGroup
            label="Vytvořené časové období"
            clearable={!!createdAtFrom || !!createdAtTo}
            field={['createdAtFrom', 'createdAtTo']}
          >
            <CustomRangeContainer>
              <DateContainer>
                <DateControl
                  name="createdAtFrom"
                  placeholder="Vyberte datum zahájení"
                  value={createdAtFrom}
                  onChange={(e) => handleSelect(e, 'createdAtFrom')}
                />
              </DateContainer>
              <EndDateContainer>
                <DateContainer>
                  <DateControl
                    name="createdAtTo"
                    placeholder="Vyberte datum ukončení"
                    value={createdAtTo}
                    onChange={(e) => handleSelect(e, 'createdAtTo')}
                  />
                </DateContainer>
              </EndDateContainer>
            </CustomRangeContainer>
          </FormGroup>
          <CommonFormGroup>
            <FormControl
              name="onlyCurrent"
              componentClass="checkbox"
              checked={!!queryParams.onlyCurrent}
              onChange={() =>
                handleToggle(queryParams.onlyCurrent, 'onlyCurrent')
              }
            />
            <ControlLabel>{__('pouze poslední pohyb za aktiva')}</ControlLabel>
          </CommonFormGroup>
        </ContainerBox>
      </CommonSideBar>
    );
  }
}

export default Sidebar;
