import {
  BarItems,
  Bulk,
  Button,
  CollapseContent,
  DateControl,
  Form as CommonForm,
  FormControl,
  ModalTrigger,
  SelectTeamMembers,
  Table,
  __,
} from '@saashq/ui/src';

import {
  ContentColumn,
  ItemRow,
  ItemText,
} from '@saashq/ui-cards/src/deals/styles';
import SelectCompanies from '@saashq/ui-contacts/src/companies/containers/SelectCompanies';
import SelectCustomers from '@saashq/ui-contacts/src/customers/containers/SelectCustomers';
import client from '@saashq/ui/src/apolloClient';
import {
  DateContainer,
  FormColumn,
  FormWrapper,
  ModalFooter,
} from '@saashq/ui/src/styles/main';
import SelectBranches from '@saashq/ui/src/team/containers/SelectBranches';
import SelectDepartments from '@saashq/ui/src/team/containers/SelectDepartments';
import { IButtonMutateProps, IFormProps } from '@saashq/ui/src/types';
import { gql } from '@apollo/client';
import _loadash from 'lodash';
import React from 'react';
import { IMovementItem, IMovementType } from '../../common/types';
import { CommonFormGroup, CommonItemRow } from '../../common/utils';
import {
  ContainerBox,
  MovementItemContainer,
  MovementTableWrapper,
} from '../../style';
import AssetChooser from '../containers/Chooser';
import { queries } from '../graphql';
import MovementItems from './MovementItem';

type Props = {
  detail: IMovementType;
  assetId?: string;
  closeModal: () => void;
  renderButton?: (props: IButtonMutateProps) => JSX.Element;
};

type General = {
  branchId?: string;
  departmentId?: string;
  customerId?: string;
  companyId?: string;
  teamMemberId?: string;
};

type State = {
  variables: IMovementItem[];
  currentItems: string[];
  description: string;
  movedAt: string;
  selectedItemsIds: string[];
  general: General;
  checkedItems: string[];
};

class Form extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.assetChooser = this.assetChooser.bind(this);
    this.changeCurrentItem = this.changeCurrentItem.bind(this);

    const { detail, assetId } = props;

    const selectedItemsIds =
      detail?.items && detail.items.map((item) => item.assetId);

    this.state = {
      variables: detail?.items || [],
      selectedItemsIds: selectedItemsIds || [],
      description: detail?.description || '',
      movedAt: detail?.movedAt || '',
      currentItems: [assetId],
      general: {},
      checkedItems: [],
    };
  }

  generateDoc() {
    const { variables, movedAt, description } = this.state;
    const { detail } = this.props;
    const items = variables.map(
      ({
        assetId,
        branchId,
        departmentId,
        customerId,
        companyId,
        teamMemberId,
      }) => ({
        assetId,
        branchId,
        departmentId,
        customerId,
        companyId,
        teamMemberId,
      }),
    );
    const doc = { items, description, movedAt };
    if (!_loadash.isEmpty(detail)) {
      return { _id: detail._id, doc };
    }
    return { ...doc };
  }

  assetChooser(props) {
    const handleSelect = (datas) => {
      const selectedItemsIds = datas.map((data) => data._id);
      client
        .query({
          query: gql(queries.itemsCurrentLocation),
          fetchPolicy: 'network-only',
          variables: { assetIds: selectedItemsIds },
        })
        .then((res) => {
          const { currentAssetMovementItems } = res.data;
          this.setState({ selectedItemsIds });

          const selectedItems = datas.map((data) => ({
            assetId: data._id,
            assetDetail: {
              _id: data._id,
              name: data.name,
            },
          }));

          const newVariables = selectedItems.map((selectedItem) => {
            const newItem = currentAssetMovementItems.find(
              (item) => item.assetId === selectedItem.assetId,
            );
            if (newItem) {
              return newItem;
            }
            return selectedItem;
          });

          this.setState({ variables: newVariables });
        });
    };

    const updatedProps = {
      ...props,
      handleSelect,
      selectedAssetIds: this.state.selectedItemsIds,
    };

    return <AssetChooser {...updatedProps} />;
  }

  assetChooserTrigger = (<Button>Vyberte Aktiva</Button>);

  assetChooserContent(trigger) {
    return (
      <ModalTrigger
        title="Vyberte Aktiva"
        content={this.assetChooser}
        trigger={trigger}
        size="lg"
      />
    );
  }

  renderChooser() {
    return <>{this.assetChooserContent(this.assetChooserTrigger)}</>;
  }

  renderInfoSelection(label, asset, value) {
    let { variables } = this.state;

    let Selection;
    let field;
    let text = '';

    if (label === 'Větve') {
      Selection = SelectBranches;
      field = 'branchId';
      text = asset?.branch?.title;
    }
    if (label === 'Oddělení') {
      Selection = SelectDepartments;
      field = 'departmentId';
      text = asset?.department?.title;
    }
    if (label === 'Člen Týmu') {
      Selection = SelectTeamMembers;
      field = 'teamMemberId';
      text = asset?.teamMember?.email;
    }
    if (label === 'Společnost') {
      Selection = SelectCompanies;
      field = 'companyId';
    }
    if (label === 'Zákazník') {
      Selection = SelectCustomers;
      field = 'customerId';
      text = asset?.customer?.primaryEmail;
    }

    const handleChange = (selected) => {
      variables = variables.map((item) =>
        item.assetId === asset.assetId
          ? { ...item, [field]: selected === '' ? null : selected }
          : item,
      );
      this.setState({ variables });
    };

    return (
      <ItemRow key={label} className="item">
        <ItemText>{label}</ItemText>
        <ContentColumn flex="3">
          <MovementItemContainer>
            <Selection
              label={`Vybrat ${label}`}
              onSelect={handleChange}
              initialValue={value || ''}
              multi={false}
              customOption={{ value: '', label: `Vybrat ${label}` }}
            />
          </MovementItemContainer>
        </ContentColumn>
      </ItemRow>
    );
  }

  changeCurrentItem(id: string) {
    const { currentItems } = this.state;

    if (currentItems.includes(id)) {
      const newCurrentItems = currentItems.filter((item) => item !== id);
      return this.setState({ currentItems: newCurrentItems });
    }

    this.setState((prev) => ({ currentItems: [...prev.currentItems, id] }));
  }

  handleGeneralDate = (e) => {
    this.setState({ movedAt: e });
  };

  handleGeneralDescription = (e) => {
    const { value } = e.currentTarget as HTMLInputElement;

    this.setState({ description: value });
  };

  handleChangeRowItem = (prevItemId, newItem) => {
    const { variables } = this.state;
    const newVariables = variables.map((item) =>
      item.assetId === prevItemId ? newItem : item,
    );
    const removedSeletedItemIds = this.state.selectedItemsIds.filter(
      (item) => item !== prevItemId,
    );
    this.setState({
      variables: newVariables,
      selectedItemsIds: [...removedSeletedItemIds, newItem.assetId],
    });
  };

  renderGeneral() {
    const { variables, general, checkedItems } = this.state;

    const handleGeneralOptions = (value, field) => {
      this.setState({ currentItems: [] });

      const newVariables = variables.map((item) =>
        checkedItems.includes(item.assetId)
          ? { ...item, [field]: value === '' ? null : value }
          : item,
      );
      this.setState({
        variables: newVariables,
        general: { ...general, [field]: value === '' ? null : value },
      });
    };

    return (
      <CollapseContent
        title="Obecné Konfigurace Umístění"
        description={__(
          'Pokud chcete obecně změnit umístění vybraných děl, měli byste zaškrtnout políčka níže.',
        )}
      >
        <BarItems>
          <ContentColumn>
            <FormWrapper>
              <FormColumn>
                <CommonItemRow label="Větev">
                  <SelectBranches
                    label="Vyberte Pobočku"
                    name="branchId"
                    onSelect={handleGeneralOptions}
                    multi={false}
                    initialValue={general?.branchId}
                    customOption={{ value: '', label: 'Vyberte Pobočku' }}
                  />
                </CommonItemRow>
              </FormColumn>
              <FormColumn>
                <CommonItemRow label="Oddělení">
                  <SelectDepartments
                    label="Vyberte Oddělení"
                    name="departmentId"
                    onSelect={handleGeneralOptions}
                    multi={false}
                    initialValue={general?.departmentId}
                    customOption={{ value: '', label: 'Vyberte Oddělení' }}
                  />
                </CommonItemRow>
              </FormColumn>
            </FormWrapper>
            <FormWrapper>
              <FormColumn>
                <CommonItemRow label="Zákazník">
                  <SelectCustomers
                    label="Vyberte Zákazník"
                    name="customerId"
                    onSelect={handleGeneralOptions}
                    multi={false}
                    initialValue={general?.customerId}
                    customOption={{ value: '', label: 'Vyberte Zákazník' }}
                  />
                </CommonItemRow>
              </FormColumn>
              <FormColumn>
                <CommonItemRow label="Společnost">
                  <SelectCompanies
                    label="Vyberte Společnost"
                    name="companyId"
                    onSelect={handleGeneralOptions}
                    multi={false}
                    initialValue={general?.companyId}
                    customOption={{ value: '', label: 'Vyberte Společnost' }}
                  />
                </CommonItemRow>
              </FormColumn>
            </FormWrapper>
            <CommonItemRow label="Člen Týmu">
              <SelectTeamMembers
                label="Vyberte Člen Týmu"
                name="teamMemberId"
                onSelect={handleGeneralOptions}
                multi={false}
                initialValue={general?.teamMemberId}
                customOption={{ value: '', label: 'Vyberte Člen Týmu' }}
              />
            </CommonItemRow>
          </ContentColumn>
        </BarItems>
      </CollapseContent>
    );
  }

  renderRow() {
    const { variables, currentItems, selectedItemsIds, checkedItems } =
      this.state;
    const removeRow = (id) => {
      const newVariables = variables.filter((item) => item.assetId !== id);
      const newSelectedItems = selectedItemsIds.filter(
        (itemId) => itemId !== id,
      );
      if (currentItems.includes(id)) {
        const newCurrentItems = currentItems.filter((item) => item !== id);
        this.setState({ currentItems: newCurrentItems });
      }
      this.setState({
        variables: newVariables,
        selectedItemsIds: newSelectedItems,
      });
    };
    const onChangeCheckedItems = (id: string) => {
      if (checkedItems.includes(id)) {
        return this.setState({
          checkedItems: checkedItems.filter((item) => item !== id),
        });
      }
      return this.setState({ checkedItems: [...checkedItems, id] });
    };

    return variables.map((item) => (
      <MovementItems
        key={item.assetId}
        item={item}
        current={currentItems.includes(item.assetId) ? item.assetId : ''}
        changeCurrent={this.changeCurrentItem}
        removeRow={removeRow}
        selectedItems={selectedItemsIds}
        isChecked={checkedItems.includes(item.assetId)}
        onChangeBulkItems={onChangeCheckedItems}
        handleChangeRowItem={this.handleChangeRowItem}
      >
        {this.renderInfoSelection('Větve', item, item['branchId'])}
        {this.renderInfoSelection('Oddělení', item, item['departmentId'])}
        {this.renderInfoSelection('Zákazník', item, item['customerId'])}
        {this.renderInfoSelection('Společnost', item, item['companyId'])}
        {this.renderInfoSelection('Člen Týmu', item, item['teamMemberId'])}
      </MovementItems>
    ));
  }

  renderList() {
    const { variables, checkedItems } = this.state;

    const onChange = () => {
      const { checkedItems } = this.state;
      const newCheckedItems = variables.map((item) => item.assetId);
      this.setState({
        checkedItems: checkedItems.length > 0 ? [] : newCheckedItems,
      });
    };

    return (
      <MovementTableWrapper>
        <Table>
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <FormControl
                  checked={
                    variables.length > 0 &&
                    variables.length === checkedItems.length
                  }
                  componentClass="checkbox"
                  onChange={onChange}
                  color="#3B85F4"
                />
              </th>
              <th>{__('Název')}</th>
              <th>{__('Větev')}</th>
              <th>{__('Oddělení')}</th>
              <th>{__('Zákazník')}</th>
              <th>{__('Comapny')}</th>
              <th>{__('Člen Týmu')}</th>
            </tr>
          </thead>
          <tbody>{this.renderRow()}</tbody>
        </Table>
      </MovementTableWrapper>
    );
  }
  renderContent = (formProps: IFormProps) => {
    const { closeModal, renderButton, detail } = this.props;
    const { isSubmitted } = formProps;
    const { movedAt, description, variables } = this.state;

    return (
      <ContainerBox column gap={20}>
        <FormWrapper>
          <FormColumn>
            <CommonFormGroup label="Datum">
              <DateContainer>
                <DateControl
                  placeholder="Vyberte Datum"
                  onChange={this.handleGeneralDate}
                  value={movedAt}
                />
              </DateContainer>
            </CommonFormGroup>
          </FormColumn>
          <FormColumn>
            <CommonFormGroup label="Popis">
              <FormControl
                type="text"
                name="description"
                onChange={this.handleGeneralDescription}
                value={description}
                required
              />
            </CommonFormGroup>
          </FormColumn>
        </FormWrapper>

        {variables.length > 0 && this.renderGeneral()}
        {this.renderList()}

        <ContainerBox justifyCenter>
          {this.assetChooserContent(
            <Button icon="plus-circle">{__('Přidat Aktivum')}</Button>,
          )}
        </ContainerBox>
        {renderButton && (
          <ModalFooter>
            <Button btnStyle="simple" onClick={() => closeModal()}>
              Cancel
            </Button>
            {renderButton({
              text: 'Hnutí',
              values: this.generateDoc(),
              isSubmitted,
              callback: closeModal,
              object: !_loadash.isEmpty(detail),
            })}
          </ModalFooter>
        )}
      </ContainerBox>
    );
  };
  render() {
    return <CommonForm renderContent={this.renderContent} />;
  }
}

export default Form;
