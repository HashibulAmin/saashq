import Icon from '@saashq/ui/src/components/Icon';
import { __ } from '@saashq/ui/src/utils';
import { isEnabled, loadDynamicComponent } from '@saashq/ui/src/utils/core';
import React from 'react';
import { FieldWrapper, Options } from '../styles';

type Props = {
  type: string;
  onChoiceClick: (choice: string) => void;
};

type FieldProps = {
  icon: string;
  type: string;
  text: string;
};

function FieldChoice(props: Props & FieldProps) {
  const { icon, type, text, onChoiceClick } = props;

  const onClick = () => {
    onChoiceClick(type);
  };

  return (
    <FieldWrapper onClick={onClick}>
      <Icon icon={icon} size={25} />
      {text || type}
    </FieldWrapper>
  );
}

function FieldChoices(props: Props) {
  return (
    <Options>
      <FieldChoice
        {...props}
        type="input"
        text={__('Zadávání textu')}
        icon="edit-alt"
      />
      <FieldChoice
        {...props}
        type="textarea"
        text={__('Textová oblast')}
        icon="paragraph"
      />
      <FieldChoice
        {...props}
        type="check"
        text={__('Zaškrtávací políčko')}
        icon="check-square"
      />
      <FieldChoice
        {...props}
        type="radio"
        text={__('Přepínač')}
        icon="check-circle"
      />
      <FieldChoice
        {...props}
        type="select"
        text={__('Vybrat')}
        icon="sort-amount-down"
      />
      <FieldChoice {...props} type="file" text={__('File')} icon="paperclip" />
      <FieldChoice
        {...props}
        type="email"
        text={__('E-mailem')}
        icon="envelope-alt"
      />
      <FieldChoice {...props} type="phone" text={__('Phone')} icon="phone" />
      <FieldChoice
        {...props}
        type="firstName"
        text={__('Jméno')}
        icon="user-6"
      />
      <FieldChoice
        {...props}
        type="middleName"
        text={__('Prostřední jméno')}
        icon="user-6"
      />
      <FieldChoice
        {...props}
        type="lastName"
        text={__('Příjmení')}
        icon="user-6"
      />
      <FieldChoice
        {...props}
        type="company_primaryName"
        text={__('Jméno společnosti')}
        icon="building"
      />
      <FieldChoice
        {...props}
        type="company_primaryEmail"
        text={__('E-mail společnosti')}
        icon="envelope-alt"
      />
      <FieldChoice
        {...props}
        type="company_primaryPhone"
        text={__('Firemní telefon')}
        icon="phone"
      />
      <FieldChoice
        {...props}
        type="map"
        text={__('Umístění/Mapa')}
        icon="map-marker"
      />
      <FieldChoice {...props} type="html" text={__('HTML')} icon="code" />
      <FieldChoice
        {...props}
        type="objectList"
        text={__('Seznam objektů')}
        icon="sort-amount-down"
      />
      <FieldChoice
        {...props}
        type="parentField"
        text={__('Skupina')}
        icon="sort-amount-down"
      />
      {loadDynamicComponent('extendFormFieldChoice', props, true)}
    </Options>
  );
}

export default FieldChoices;
