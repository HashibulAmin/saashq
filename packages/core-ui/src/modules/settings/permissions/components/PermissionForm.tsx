import Button from 'modules/common/components/Button';
import ButtonMutate from 'modules/common/components/ButtonMutate';
import FormControl from 'modules/common/components/form/Control';
import FormGroup from 'modules/common/components/form/Group';
import ControlLabel from 'modules/common/components/form/Label';
import Info from 'modules/common/components/Info';
import TextInfo from 'modules/common/components/TextInfo';
import { ModalFooter } from 'modules/common/styles/main';
import { __, Alert } from 'modules/common/utils';
import SelectTeamMembers from '@saashq/ui/src/team/containers/SelectTeamMembers';
import React from 'react';
import Select from 'react-select-plus';
import { mutations } from '../graphql';
import { Divider, StepBody, StepHeader, StepItem } from '../styles';
import { IActions, IModule } from '../types';
import { IUserGroup } from '@saashq/ui-settings/src/permissions/types';
import {
  correctValue,
  filterActions,
  generatedList,
  generateListParams,
  generateModuleParams,
} from './utils';

type Props = {
  modules: IModule[];
  actions: IActions[];
  groups: IUserGroup[];
  refetchQueries: any;
  closeModal: () => void;
};

type State = {
  selectedModule: string;
  selectedActions: IActions[];
  selectedUserIds: string[];
  selectedGroups: IUserGroup[];
  valueChanged: boolean;
  isSubmitted: boolean;
};

class PermissionForm extends React.Component<Props, State> {
  state = {
    selectedModule: '',
    selectedActions: [],
    selectedUserIds: [],
    selectedGroups: [],
    valueChanged: false,
    isSubmitted: false,
  };

  save = (e: React.FormEvent) => {
    e.preventDefault();

    const { selectedModule, selectedActions, selectedUserIds, selectedGroups } =
      this.state;

    if (!selectedModule) {
      return Alert.error('Vyberte modul!');
    }

    if (!this.hasItems(selectedActions)) {
      return Alert.error('Vyberte prosím alespoň jednu akci!');
    }

    if (!this.hasItems(selectedGroups) && !this.hasItems(selectedUserIds)) {
      return Alert.error(
        'Vyberte prosím alespoň jednu skupinu nebo uživatele!',
      );
    }

    return this.setState({ isSubmitted: true });
  };

  getVariables = () => {
    const {
      selectedModule,
      selectedActions,
      selectedUserIds,
      selectedGroups,
      valueChanged,
    } = this.state;

    return {
      module: selectedModule,
      actions: this.collectValues(selectedActions),
      userIds: selectedUserIds,
      groupIds: this.collectValues(selectedGroups),
      allowed: valueChanged,
    };
  };

  onChange = () => {
    this.setState({ valueChanged: true });
  };

  hasItems = (items: string[]) => {
    return items.length > 0 ? true : false;
  };

  isModuleSelected = () => {
    if (this.state.selectedModule) {
      return true;
    }

    return false;
  };

  select = <T extends keyof State>(name: T, value) => {
    this.setState({ [name]: value } as Pick<State, keyof State>);
  };

  changeModule = (item: generatedList) => {
    const selectedModule = correctValue(item);

    this.setState({
      selectedModule,
      selectedActions: [],
    });
  };

  collectValues = (items: generatedList[]) => {
    return items.map((item) => item.value);
  };

  renderContent() {
    const { modules, actions, groups } = this.props;
    const {
      selectedModule,
      selectedActions,
      selectedUserIds,
      selectedGroups,
      valueChanged,
    } = this.state;

    const usersOnChange = (users) => this.select('selectedUserIds', users);

    return (
      <>
        <Info>
          <strong>Uživatelská vs. Skupinová Oprávnění</strong>
          <br />
          <span>
            Když je člen týmu součástí dvou nebo více skupin uživatelů s různými
            úrovně oprávnění,
          </span>
          <TextInfo textStyle="danger">
            negativní povolení bude mít přednost.
          </TextInfo>
          <br />
          <span>
            Pokud jste například součástí "Skupiny Administrátorů" se všemi
            povolena, ale zahrnuli jste se do "Podpora Skupina" s menším počtem
            oprávnění,
          </span>
          <TextInfo textStyle="danger">
            možná nebudete moci provádět určité akce.
          </TextInfo>
        </Info>
        <StepItem>
          <StepHeader
            number="1"
            isDone={this.isModuleSelected() && this.hasItems(selectedActions)}
          >
            {__('Co může udělat akce')}
          </StepHeader>
          <StepBody>
            <FormGroup>
              <ControlLabel required={true}>Vyberte modul</ControlLabel>
              <Select
                placeholder={__('Vyberte modul')}
                options={generateModuleParams(modules)}
                value={selectedModule}
                onChange={this.changeModule}
              />
            </FormGroup>
            <Divider>{__('Pak')}</Divider>
            <FormGroup>
              <ControlLabel required={true}>Vyberte akce</ControlLabel>
              <Select
                placeholder={__('Vyberte akce')}
                options={filterActions(actions, selectedModule)}
                value={selectedActions}
                disabled={!this.isModuleSelected()}
                onChange={this.select.bind(this, 'selectedActions')}
                multi={true}
              />
            </FormGroup>
          </StepBody>
        </StepItem>

        <StepItem>
          <StepHeader
            number="2"
            isDone={
              this.hasItems(selectedGroups) || this.hasItems(selectedUserIds)
            }
          >
            {__('Kdo může')}
          </StepHeader>
          <StepBody>
            <FormGroup>
              <ControlLabel required={true}>Vyberte skupiny</ControlLabel>
              <Select
                placeholder={__('Vyberte skupiny')}
                options={generateListParams(groups)}
                value={selectedGroups}
                onChange={this.select.bind(this, 'selectedGroups')}
                multi={true}
              />
            </FormGroup>
            <Divider>{__('Nebo')}</Divider>
            <FormGroup>
              <ControlLabel required={true}>Vyberte uživatele</ControlLabel>

              <SelectTeamMembers
                label="Vyberte uživatele"
                name="selectedUserIds"
                initialValue={selectedUserIds}
                onSelect={usersOnChange}
              />
            </FormGroup>
          </StepBody>
        </StepItem>

        <StepItem>
          <StepHeader number="3" isDone={valueChanged}>
            {__('Udělte povolení')}
          </StepHeader>
          <StepBody>
            <FormGroup>
              <ControlLabel>Dovolit</ControlLabel>

              <FormControl
                componentClass="checkbox"
                defaultChecked={false}
                id="allowed"
                onChange={this.onChange}
              />
              <p>{__('Zkontrolujte, zda je povoleno povolení')}</p>
            </FormGroup>
          </StepBody>
        </StepItem>
      </>
    );
  }

  render() {
    const { closeModal, refetchQueries } = this.props;

    return (
      <form onSubmit={this.save}>
        {this.renderContent()}
        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            onClick={closeModal}
            icon="cancel-1"
          >
            Zrušení
          </Button>

          <ButtonMutate
            mutation={mutations.permissionAdd}
            variables={this.getVariables()}
            callback={closeModal}
            refetchQueries={refetchQueries}
            isSubmitted={this.state.isSubmitted}
            type="submit"
            successMessage={__(`Úspěšně jste přidali oprávnění`) + '.'}
          />
        </ModalFooter>
      </form>
    );
  }
}

export default PermissionForm;
