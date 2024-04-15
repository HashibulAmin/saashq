import { Row } from '@saashq/ui-inbox/src/settings/integrations/styles';
import Button from '@saashq/ui/src/components/Button';
import CollapseContent from '@saashq/ui/src/components/CollapseContent';
import FormControl from '@saashq/ui/src/components/form/Control';
import Form from '@saashq/ui/src/components/form/Form';
import FormGroup from '@saashq/ui/src/components/form/Group';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import ModifiableList from '@saashq/ui/src/components/ModifiableList';
import Toggle from '@saashq/ui/src/components/Toggle';
import Map from '@saashq/ui/src/containers/map/Map';
import { ModalFooter } from '@saashq/ui/src/styles/main';
import {
  IButtonMutateProps,
  IField,
  IFieldLogic,
  IFormProps,
  ILocationOption,
  IObjectListConfig,
} from '@saashq/ui/src/types';
import { __, loadDynamicComponent } from '@saashq/ui/src/utils/core';
import React from 'react';

import PropertyGroupForm from '../containers/PropertyGroupForm';
import PropertyLogics from '../containers/PropertyLogics';
import { IFieldGroup } from '../types';
import LocationOptions from './LocationOptions';
import ObjectListConfigs from './ObjectListConfigs';

type Props = {
  queryParams: any;
  field?: IField;
  groups: IFieldGroup[];
  type: string;
  inputTypes: { value: string; label: string }[];
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
};

type State = {
  options: any[];
  locationOptions: any[];
  objectListConfigs: IObjectListConfig[];
  type: string;
  hasOptions: boolean;
  add: boolean;
  currentLocation: ILocationOption;
  searchable: boolean;
  showInCard: boolean;
  logics?: IFieldLogic[];
  logicAction?: string;
  isSubmitted?: boolean;
};

class PropertyForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    let doc: any = {
      options: [],
      type: '',
      locationOptions: [],
      objectListConfigs: [],
      hasOptions: false,
      searchable: false,
      showInCard: false,
    };

    if (props.field) {
      const {
        type,
        options,
        locationOptions,
        objectListConfigs,
        searchable = false,
        showInCard = false,
      } = props.field;

      doc = {
        ...doc,
        type,
        searchable,
        showInCard,
      };

      if (
        type === 'select' ||
        type === 'multiSelect' ||
        type === 'radio' ||
        type === 'check'
      ) {
        doc = {
          type,
          hasOptions: true,
          options: Object.assign([], options || []),
          locationOptions: [],
          objectListConfigs: [],
          searchable: searchable || false,
          showInCard,
        };
      }

      if (type === 'map') {
        doc = {
          type,
          hasOptions: false,
          options: [],
          locationOptions: Object.assign([], locationOptions || []),
          objectListConfigs: Object.assign([], objectListConfigs || []),
          searchable: searchable || false,
          showInCard: false,
        };
      }

      if (objectListConfigs) {
        doc.objectListConfigs = objectListConfigs.map((e) => {
          return {
            key: e.key,
            label: e.label,
            type: e.type,
          };
        });
      }
    }

    this.state = {
      ...doc,
      currentLocation: { lat: 0, lng: 0 },
      add: false,
      logics: props.field && props.field.logics ? props.field.logics : [],
      logicAction: props.field && props.field.logicAction,
    };
  }

  generateDoc = (values: {
    _id?: string;
    groupId: string;
    validation: string;
    text: string;
    description: string;
    logicAction: string;
    logics: IFieldLogic[];
  }) => {
    const { field } = this.props;
    const {
      type,
      options,
      locationOptions,
      objectListConfigs,
      showInCard,
      searchable,
      logicAction,
      logics,
    } = this.state;

    const finalValues = values;

    if (field) {
      finalValues._id = field._id;
    }

    return {
      ...finalValues,
      contentType: this.props.type,
      type,
      options,
      locationOptions,
      objectListConfigs: objectListConfigs.map((e) => {
        return {
          key: e.key,
          label: e.label,
          type: e.type,
        };
      }),
      searchable,
      showInCard,
      logicAction,
      logics,
    };
  };

  onChangeOption = (options) => {
    this.setState({ options });
  };

  onChangeLocationOptions = (locationOptions) => {
    this.setState({ locationOptions });
  };

  onChangeObjectListConfig = (objectListConfigs) => {
    this.setState({ objectListConfigs });
  };

  onRemoveOption = (options) => {
    this.setState({ options });
  };

  onTypeChange = (e) => {
    const value = e.target.value;
    let doc: { hasOptions: boolean; options: any[] } = {
      hasOptions: false,
      options: [],
    };

    if (
      value === 'select' ||
      value === 'multiSelect' ||
      value === 'check' ||
      value === 'radio'
    ) {
      doc = { hasOptions: true, options: this.state.options };
    }

    this.setState({ type: value, ...doc });
  };

  onChangeSearchable = (e) => {
    const isChecked = (e.currentTarget as HTMLInputElement).checked;
    this.setState({ searchable: isChecked });
  };

  onSwitchChange = (e) => {
    this.setState({ showInCard: e.target.checked });
  };

  onChangeLogicAction = (value) => {
    this.setState({ logicAction: value });
  };

  onChangeLogics = (logics) => {
    this.setState({ logics });
  };

  renderOptions = () => {
    if (!this.state.hasOptions) {
      return null;
    }

    return (
      <ModifiableList
        options={this.state.options}
        onChangeOption={this.onChangeOption}
      />
    );
  };

  renderObjectListConfigs = () => {
    if (!['objectList', 'labelSelect'].includes(this.state.type)) {
      return null;
    }

    const { objectListConfigs = [] } = this.state;

    return (
      <FormGroup>
        <ControlLabel>Konfigurace seznamu objektů:</ControlLabel>

        <ObjectListConfigs
          objectListConfigs={objectListConfigs}
          onChange={this.onChangeObjectListConfig}
        />
      </FormGroup>
    );
  };

  renderLocationOptions = () => {
    if (this.state.type !== 'map') {
      return null;
    }

    const { currentLocation, locationOptions = [] } = this.state;

    return (
      <FormGroup>
        <ControlLabel htmlFor="locationOptions">Možnosti:</ControlLabel>
        {locationOptions.length > 0 && (
          <Map
            id={this.props.field?._id || Math.random().toString(10)}
            center={currentLocation}
            locationOptions={locationOptions}
            streetViewControl={false}
            onChangeLocationOptions={this.onChangeLocationOptions}
            mode="config"
          />
        )}

        <LocationOptions
          locationOptions={locationOptions}
          onChange={this.onChangeLocationOptions}
        />
      </FormGroup>
    );
  };

  renderShowInCard = () => {
    const { type } = this.props;
    const { showInCard } = this.state;

    if (
      !['cards:deal', 'cards:ticket', 'cards:task', 'cards:purchase'].includes(
        type,
      )
    ) {
      return null;
    }

    return (
      <FormGroup>
        <ControlLabel>Zobrazit na kartě</ControlLabel>
        <Toggle
          checked={showInCard}
          onChange={this.onSwitchChange}
          icons={{
            checked: <span>Ano</span>,
            unchecked: <span>Ne</span>,
          }}
        />
      </FormGroup>
    );
  };

  renderAddGroup = () => {
    const { queryParams } = this.props;

    const trigger = <Button>Vytvořit skupinu</Button>;

    const content = (props) => (
      <PropertyGroupForm {...props} queryParams={queryParams} />
    );

    return (
      <ModalTrigger
        title="Vytvořit skupinu"
        trigger={trigger}
        content={content}
      />
    );
  };

  renderContent = (formProps: IFormProps) => {
    const { groups, inputTypes, closeModal, renderButton, field } = this.props;

    const object = field || ({} as IField);

    const { values, isSubmitted } = formProps;
    const { type, searchable } = this.state;

    return (
      <>
        <FormGroup>
          <ControlLabel required={true}>Název:</ControlLabel>
          <FormControl
            {...formProps}
            name="text"
            defaultValue={object.text || ''}
            required={true}
            autoFocus={true}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Popis:</ControlLabel>
          <FormControl
            {...formProps}
            name="description"
            componentClass="textarea"
            defaultValue={object.description || ''}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Kód:</ControlLabel>
          <FormControl
            {...formProps}
            name="code"
            defaultValue={object.code || ''}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel required={true}>Skupina:</ControlLabel>
          <Row>
            <FormControl
              {...formProps}
              name="groupId"
              componentClass="select"
              defaultValue={object.groupId || ''}
              required={true}
            >
              {groups
                .filter((e) => !e.isDefinedBySaasHQ)
                .map((group) => {
                  return (
                    <option key={group._id} value={group._id}>
                      {group.name}
                    </option>
                  );
                })}
            </FormControl>
            {this.renderAddGroup()}
          </Row>
        </FormGroup>

        <FormGroup>
          <ControlLabel required={true}>Typ:</ControlLabel>

          <FormControl
            {...formProps}
            name="type"
            componentClass="select"
            value={type}
            onChange={this.onTypeChange}
            required={true}
          >
            <option />
            {inputTypes.map((inputType) => {
              return (
                <option value={inputType.value} key={Math.random()}>
                  {inputType.label}
                </option>
              );
            })}
          </FormControl>
        </FormGroup>
        {this.renderOptions()}
        {this.renderObjectListConfigs()}
        {this.renderLocationOptions()}
        {this.renderShowInCard()}

        {type === 'input' && (
          <FormGroup>
            <ControlLabel>Validace:</ControlLabel>

            <FormControl
              {...formProps}
              componentClass="select"
              name="validation"
              defaultValue={object.validation || ''}
            >
              <option />
              <option value="email">E-mailem</option>
              <option value="number">Číslo</option>
              <option value="date">Datum</option>
              <option value="datetime">Čas Schůzky</option>
            </FormControl>
          </FormGroup>
        )}

        <FormGroup>
          <FormControl
            componentClass="checkbox"
            name="searchable"
            checked={searchable}
            onChange={this.onChangeSearchable}
          >
            {__('Prohledávatelné')}
          </FormControl>
        </FormGroup>

        {type.length > 0 && (
          <CollapseContent title={__('Logika')} compact={true}>
            <PropertyLogics
              contentType={this.props.queryParams.type}
              logics={this.state.logics || []}
              action={this.state.logicAction || 'show'}
              onLogicsChange={this.onChangeLogics}
              onActionChange={this.onChangeLogicAction}
            />
          </CollapseContent>
        )}

        {field && loadDynamicComponent('fieldConfig', { field, isSubmitted })}

        <ModalFooter>
          <Button btnStyle="simple" onClick={closeModal} icon="times-circle">
            Zavřít
          </Button>

          {renderButton({
            name: 'property',
            values: this.generateDoc(values),
            isSubmitted,
            callback: closeModal,
            object: field,
          })}
        </ModalFooter>
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default PropertyForm;
