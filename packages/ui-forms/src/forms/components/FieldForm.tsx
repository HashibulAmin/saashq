import SelectProperty from '@saashq/ui-forms/src/settings/properties/containers/SelectProperty';
import { IProductCategory } from '@saashq/ui-products/src/types';
import Button from '@saashq/ui/src/components/Button';
import CollapseContent from '@saashq/ui/src/components/CollapseContent';
import FormControl from '@saashq/ui/src/components/form/Control';
import FormGroup from '@saashq/ui/src/components/form/Group';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import Icon from '@saashq/ui/src/components/Icon';
import { FlexItem } from '@saashq/ui/src/components/step/styles';
import Toggle from '@saashq/ui/src/components/Toggle';
import { RichTextEditor } from '@saashq/ui/src/components/richTextEditor/TEditor';
import { IField, IFieldLogic, IOption } from '@saashq/ui/src/types';
import { loadDynamicComponent, __ } from '@saashq/ui/src/utils';
import { isEnabled } from '@saashq/ui/src/utils/core';

import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select-plus';

import {
  FlexRow,
  LeftSection,
  Preview,
  PreviewSection,
  ShowPreview,
} from '../styles';
import FieldLogics from './FieldLogics';
import FieldPreview from './FieldPreview';
import LocationOptions from './LocationOptions';
import ObjectListConfigs from './ObjectListConfigs';
import GroupedField from './GroupedField';

type Props = {
  onSubmit: (field: IField) => void;
  onDelete: (field: IField) => void;
  onCancel: () => void;
  mode: 'create' | 'update';
  field: IField;
  fields: IField[];
  numberOfPages: number;
  productCategories?: IProductCategory[];
};

type State = {
  field: IField;
  selectedOption?: IOption;
  group?: string;
};

class FieldForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { field } = props;

    const selectedOption = field.associatedField && {
      value: field.associatedField._id,
      label: field.associatedField.text,
    };

    let group =
      (field.associatedField && field.associatedField.contentType) || '';

    if (field.type.includes('customerLinks')) {
      group = 'customer';
    }

    if (field.type.includes('companyLinks')) {
      group = 'company';
    }

    this.state = {
      field,
      selectedOption,
      group,
    };
  }

  onFieldChange = (
    name: string,
    value: string | boolean | number | string[] | number[] | IFieldLogic[],
  ) => {
    this.setFieldAttrChanges(name, value);
  };

  onEditorChange = (content: string) => {
    const { field } = this.state;

    field.content = content;

    this.setState({ field });
  };

  onDescChange = (content: string) => {
    const { field } = this.state;
    const description = content;

    field.description = description;

    this.setState({ field });
  };

  onPropertyGroupChange = (e) => {
    this.setState({
      group: (e.currentTarget as HTMLInputElement).value,
    });
  };

  onChangeLocation = (options) => {
    this.setFieldAttrChanges('locationOptions', options);
  };

  onChangeObjectListConfig = (objectListConfigs) => {
    this.setFieldAttrChanges('objectListConfigs', objectListConfigs);
  };

  onPropertyChange = (selectedField: IField) => {
    const { field, group } = this.state;

    field.associatedFieldId = selectedField._id;
    field.validation = selectedField.validation;
    field.options = selectedField.options;
    field.type = selectedField.type;
    field.text = selectedField.text;
    field.description = selectedField.description;

    if (group === 'contacts:company') {
      switch (field.type) {
        case 'avatar':
          field.type = 'company_avatar';
          break;
        case 'description':
          field.type = 'company_description';
          break;
        case 'isSubscribed':
          field.type = 'company_isSubscribed';
          break;
        case 'size':
          field.validation = 'number';
          break;

        default:
          break;
      }
    }

    this.setState({
      field,
      selectedOption: {
        value: selectedField._id,
        label: selectedField.text || '',
      },
    });
  };

  onSubmit = (e) => {
    e.persist();

    const { field } = this.state;

    this.props.onSubmit(field);
  };

  setFieldAttrChanges(
    attributeName: string,
    value: string | boolean | number | string[] | number[] | IFieldLogic[],
  ) {
    const { field } = this.state;
    field[attributeName] = value;

    this.setState({ field });
  }

  renderValidation() {
    const { field } = this.state;
    const type = field.type;

    if (type !== 'input' && type !== 'email' && type !== 'phone') {
      return null;
    }

    const validation = (e) =>
      this.onFieldChange(
        'validation',
        (e.currentTarget as HTMLInputElement).value,
      );

    return (
      <FormGroup>
        <ControlLabel htmlFor="validation">Validace:</ControlLabel>

        <FormControl
          id="validation"
          componentClass="select"
          value={field.validation || ''}
          onChange={validation}
        >
          <option />
          <option value="email">{__('E-mailem')}</option>
          <option value="number">{__('Číslo')}</option>
          <option value="datetime">{__('Čas Schůzky')}</option>
          <option value="date">{__('Datum')}</option>
          <option value="phone">{__('Telefon')}</option>
        </FormControl>
      </FormGroup>
    );
  }

  renderOptions() {
    const { field } = this.state;

    const onChange = (e) =>
      this.onFieldChange(
        'options',
        (e.currentTarget as HTMLInputElement).value.split('\n'),
      );

    if (!['select', 'check', 'radio', 'multiSelect'].includes(field.type)) {
      return null;
    }

    return (
      <FormGroup>
        <ControlLabel htmlFor="type">Možnosti:</ControlLabel>

        <FormControl
          id="options"
          componentClass="textarea"
          value={(field.options || []).join('\n')}
          onChange={onChange}
        />
      </FormGroup>
    );
  }

  renderLocationOptions() {
    const { field } = this.state;

    if (field.type !== 'map') {
      return null;
    }

    return (
      <FormGroup>
        <ControlLabel htmlFor="locationOptions">Možnosti:</ControlLabel>
        <LocationOptions
          locationOptions={field.locationOptions || []}
          onChange={this.onChangeLocation}
        />
      </FormGroup>
    );
  }

  renderExtraButton() {
    const { mode, field } = this.props;

    if (mode === 'create') {
      return null;
    }

    const onDelete = (e) => {
      e.preventDefault();
      this.props.onDelete(field);
    };

    return (
      <Button btnStyle="danger" onClick={onDelete} icon="minus-circle-1">
        Vymazat
      </Button>
    );
  }

  renderMultipleSelectCheckBox() {
    const { field } = this.state;

    const isSelect = ['select', 'multiSelect'].includes(field.type);

    if (!isSelect) {
      return;
    }

    const onChange = (e) => {
      field.type = e.target.checked ? 'multiSelect' : 'select';
      this.setState({ field });
    };

    return (
      <FormGroup>
        <FlexRow>
          <ControlLabel htmlFor="description">
            {__('Vyberte více hodnot')}
          </ControlLabel>
          <Toggle
            defaultChecked={field.type === 'multiSelect'}
            icons={{
              checked: <span>Ano</span>,
              unchecked: <span>Ne</span>,
            }}
            onChange={onChange}
          />
        </FlexRow>
      </FormGroup>
    );
  }

  renderObjectListOptions() {
    const { field } = this.state;

    if (field.type !== 'objectList') {
      return null;
    }

    return (
      <FormGroup>
        <ControlLabel htmlFor="objectListConfigs">
          Konfigurace seznamu objektů:
        </ControlLabel>
        <ObjectListConfigs
          objectListConfigs={field.objectListConfigs || []}
          onChange={this.onChangeObjectListConfig}
        />
      </FormGroup>
    );
  }

  renderOptionsValue() {
    const { field } = this.state;
    const { optionsValues } = this.props.field;

    const handleChange = (e) => {
      const { value } = e.currentTarget as HTMLInputElement;

      this.onFieldChange('optionsValues', value);
    };

    if (['select', 'radio'].includes(field.type)) {
      return (
        <CollapseContent title={__('Hodnota Pole')}>
          <FormGroup>
            <ControlLabel>{__('Hodnota')}</ControlLabel>
            <FormControl
              id="FieldValue"
              componentClass="textarea"
              defaultValue={optionsValues}
              onChange={handleChange}
            />
          </FormGroup>
        </CollapseContent>
      );
    }
  }

  renderPageSelect() {
    const { numberOfPages } = this.props;
    const { field } = this.state;

    if (numberOfPages === 1) {
      return null;
    }

    const options: Array<{ label: number; value: number }> = [];

    for (let i = 0; i < numberOfPages; i++) {
      options.push({ label: i + 1, value: i + 1 });
    }

    const onChange = (option) => {
      this.onFieldChange('pageNumber', option.value);
    };

    return (
      <FormGroup>
        <ControlLabel htmlFor="pageNumber">Číslo stránky</ControlLabel>
        <Select
          isRequired={true}
          value={field.pageNumber || 1}
          onChange={onChange}
          options={options}
          clearable={false}
        />
      </FormGroup>
    );
  }

  renderGroupedField() {
    const { fields } = this.props;
    const { field } = this.state;

    const onChange = (value) => {
      this.setState({ field: value });
    };

    if (field.type !== 'parentField') {
      return null;
    }

    return <GroupedField field={field} fields={fields} onChange={onChange} />;
  }

  renderLeftContent() {
    const { fields } = this.props;
    const { field } = this.state;

    const text = (e) =>
      this.onFieldChange('text', (e.currentTarget as HTMLInputElement).value);

    const toggle = (e) =>
      this.onFieldChange(
        'isRequired',
        (e.currentTarget as HTMLInputElement).checked,
      );

    return (
      <>
        <CollapseContent
          title={__('Obecné nastavení')}
          compact={true}
          open={true}
        >
          <FormGroup>
            <ControlLabel htmlFor="text" required={true}>
              Štítek Pole
            </ControlLabel>

            <FormControl
              id="FieldLabel"
              type="text"
              value={field.text || ''}
              onChange={text}
              autoFocus={true}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel htmlFor="description">Popis pole</ControlLabel>
            <RichTextEditor
              content={field.description || ''}
              toolbar={[
                'source',
                'bold',
                'italic',
                'orderedList',
                'bulletList',
                'link',
                'unlink',
                '|',
                'image',
              ]}
              autoGrow={true}
              autoGrowMinHeight={120}
              onChange={this.onDescChange}
              name={`html_${field._id}`}
            />
          </FormGroup>

          {this.renderPageSelect()}

          {this.renderValidation()}

          <FormGroup>
            <FlexRow>
              <ControlLabel htmlFor="description">
                {__('Políčko je vyžadováno')}
              </ControlLabel>
              <Toggle
                defaultChecked={field.isRequired || false}
                icons={{
                  checked: <span>Ano</span>,
                  unchecked: <span>Ne</span>,
                }}
                onChange={toggle}
              />
            </FlexRow>
            {isEnabled('payment') && field.type === 'productCategory' && (
              <p>
                {__('Pokud potřebujete povolit platbu, pole musí být povinné!')}
              </p>
            )}
          </FormGroup>

          {this.renderGroupedField()}

          {this.renderOptions()}
          {this.renderGroupName()}

          {this.renderLocationOptions()}

          {this.renderMultipleSelectCheckBox()}

          {this.renderObjectListOptions()}

          {this.renderColumn()}
          {loadDynamicComponent('extendFormField', {
            field,
            onChange: this.onFieldChange,
          })}
          {this.renderHtml()}
          {this.renderCustomPropertyGroup()}
          {this.renderCustomProperty()}
        </CollapseContent>
        {fields.length > 0 && (
          <CollapseContent title={__('Logika')} compact={true}>
            <FieldLogics
              fields={fields.filter(
                (f) => !(field.subFieldIds || []).includes(f._id),
              )}
              currentField={field}
              onFieldChange={this.onFieldChange}
            />
          </CollapseContent>
        )}
        {this.renderOptionsValue()}
      </>
    );
  }

  renderContent() {
    const { mode, onCancel } = this.props;
    const { field } = this.state;

    return (
      <FlexItem>
        <LeftSection>
          {this.renderLeftContent()}

          <Modal.Footer>
            <Button
              btnStyle="simple"
              type="button"
              icon="times-circle"
              onClick={onCancel}
            >
              Zrušení
            </Button>

            {this.renderExtraButton()}

            <Button
              onClick={this.onSubmit}
              btnStyle="success"
              icon={mode === 'update' ? 'check-circle' : 'plus-circle'}
            >
              {mode === 'update' ? 'Save' : 'Add to Form'}
            </Button>
          </Modal.Footer>
        </LeftSection>

        <PreviewSection>
          <Preview>
            <FieldPreview field={field} otherFields={this.props.fields} />

            <ShowPreview>
              <Icon icon="eye" /> {__('Náhled pole')}
            </ShowPreview>
          </Preview>
        </PreviewSection>
      </FlexItem>
    );
  }

  renderCustomPropertyGroup() {
    const { field, group } = this.state;

    if (
      [
        'email',
        'phone',
        'firstName',
        'lastName',
        'middleName',
        'companyName',
        'companyEmail',
        'companyPhone',
        'html',
        'productCategory',
        'parentField',
      ].includes(field.type)
    ) {
      return null;
    }

    return (
      <>
        <FormGroup>
          <ControlLabel>Typ majetku:</ControlLabel>
          <FormControl
            id="propertyGroup"
            componentClass="select"
            defaultValue={group}
            onChange={this.onPropertyGroupChange}
          >
            <option value={''} />
            <option value={'contacts:customer'}>Zákazník</option>
            <option value={'contacts:company'}>Společnost</option>
          </FormControl>
        </FormGroup>
      </>
    );
  }

  renderProductCategory() {
    const { field } = this.state;
    const { productCategories = [] } = this.props;

    if (field.type !== 'productCategory') {
      return null;
    }

    const onCategoryChange = (e) => {
      this.onFieldChange(
        'productCategoryId',
        (e.currentTarget as HTMLInputElement).value,
      );
    };

    return (
      <>
        <FormGroup>
          <ControlLabel>Kategorie:</ControlLabel>
          <FormControl
            id="productCategories"
            componentClass="select"
            defaultValue={field.productCategoryId || ''}
            onChange={onCategoryChange}
          >
            <option>-</option>
            {productCategories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </FormControl>
        </FormGroup>
      </>
    );
  }

  renderColumn() {
    const { field } = this.state;

    if (['html', 'parentField'].includes(field.type)) {
      return;
    }

    const onChangeColumn = (e) =>
      this.onFieldChange(
        'column',
        parseInt((e.currentTarget as HTMLInputElement).value, 10),
      );

    return (
      <FormGroup>
        <ControlLabel htmlFor="validation">Šířka pole:</ControlLabel>

        <FormControl
          id="validation"
          componentClass="select"
          value={field.column || ''}
          onChange={onChangeColumn}
        >
          <option value={1}>Plná šířka</option>
          <option value={2}>Poloviční šířka</option>
          <option value={3}>1/3 šířka</option>
          <option value={4}>1/4 šířka</option>
        </FormControl>
      </FormGroup>
    );
  }

  renderHtml() {
    const { field } = this.state;

    if (field.type !== 'html') {
      return;
    }

    return (
      <FormGroup>
        <ControlLabel htmlFor="html">HTML:</ControlLabel>
        <RichTextEditor
          content={field.content || ''}
          toolbar={[
            'source',
            'bold',
            'italic',
            'orderedList',
            'bulletList',
            'link',
            'unlink',
            '|',
            'image',
          ]}
          autoFocus={true}
          autoGrow={true}
          autoGrowMinHeight={160}
          onChange={this.onEditorChange}
          name={`html_${field._id}`}
        />
      </FormGroup>
    );
  }

  renderGroupName() {
    const { field } = this.state;
    if (field.type === 'parentField') {
      return null;
    }

    const groupName = (e) =>
      this.onFieldChange(
        'groupName',
        (e.currentTarget as HTMLInputElement).value,
      );
    return (
      <FormGroup>
        <ControlLabel htmlFor="text" required={false}>
          Skupinové Jméno
        </ControlLabel>
        <p>Použijte s logikou a seskupte více polí</p>
        <FormControl
          id="GroupName"
          type="text"
          value={field.groupName || ''}
          onChange={groupName}
          autoFocus={false}
        />
      </FormGroup>
    );
  }

  renderCustomProperty() {
    const { selectedOption, group } = this.state;

    if (group === '') {
      return;
    }

    const defaultValue =
      (selectedOption && selectedOption.value) ||
      this.props.field.associatedFieldId;

    return (
      <>
        <FormGroup>
          <SelectProperty
            queryParams={{ type: group }}
            defaultValue={defaultValue}
            description="Všechna data shromážděná prostřednictvím tohoto pole se zkopírují do:"
            onChange={this.onPropertyChange}
          />
        </FormGroup>
      </>
    );
  }

  render() {
    const { mode, field, onCancel } = this.props;

    return (
      <Modal
        show={true}
        size="xl"
        onHide={onCancel}
        animation={false}
        enforceFocus={false}
      >
        <Modal.Header closeButton={true}>
          <Modal.Title>
            {mode === 'create' ? 'Přidat' : 'Upravit'} {field.type} pole
          </Modal.Title>
        </Modal.Header>
        <Modal.Body id="ModalBody" className="md-padding">
          {this.renderContent()}
        </Modal.Body>
      </Modal>
    );
  }
}

export default FieldForm;
