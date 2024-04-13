import { FieldsCombinedByType } from '@saashq/ui-forms/src/settings/properties/types';
import { ISegment } from '@saashq/ui-segments/src/types';
import FormControl from '@saashq/ui/src/components/form/Control';
import CommonForm from '@saashq/ui/src/components/form/Form';
import Toggle from '@saashq/ui/src/components/Toggle';
import { IFormProps } from '@saashq/ui/src/types';
import { __ } from '@saashq/ui/src/utils/core';
import React from 'react';

import { Checkbox, EnrollmentWrapper, StyledToggle } from '../../../styles';
import { ITrigger } from '../../../types';

export type ReEnrollmentRule = {
  property: string;
  description?: string;
};

type Props = {
  trigger: ITrigger;
  segment?: ISegment;
  fields: FieldsCombinedByType[];
  closeModal?: () => void;
  afterSave?: () => void;
  addConfig: (trigger: ITrigger, id?: string, config?: any) => void;
};

type State = {
  reEnroll: boolean;
  checked: string[];
};

class ReEnrollment extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const { trigger } = this.props;
    const { config = {} } = trigger;

    this.state = {
      reEnroll: config.reEnrollment ? true : false,
      checked: config.reEnrollmentRules || [],
    };
  }

  onChangeConfig = () => {
    const { reEnroll, checked } = this.state;
    const { trigger, addConfig } = this.props;

    const config = {
      reEnrollment: reEnroll,
      reEnrollmentRules: checked,
    };

    addConfig(trigger, trigger.id, config);
  };

  onSwitchHandler = (e) => {
    this.setState({ reEnroll: e.target.checked }, () => {
      this.onChangeConfig();
    });
  };

  onChangeCheckbox = (e) => {
    const property = e.target.value;
    const isCheck = e.target.checked;
    const { checked } = this.state;
    let updated: string[] = [];

    if (isCheck) {
      updated = [...checked, property];
    } else {
      updated = checked.filter((ch) => ch !== property);
    }

    this.setState({ checked: updated }, () => {
      this.onChangeConfig();
    });
  };

  renderCheckbox = (condition) => {
    const { fields } = this.props;
    const { checked, reEnroll } = this.state;

    const labelByName = {};

    for (const cond of condition.conditions) {
      const field = fields.find((f) => f.name === cond.propertyName) || {
        label: '',
      };
      labelByName[cond.propertyName] = field.label || cond.propertyName;
    }

    return Object.keys(labelByName).map((propertyName) => (
      <FormControl
        key={Math.random()}
        componentClass="checkbox"
        onChange={this.onChangeCheckbox}
        checked={reEnroll ? checked.includes(propertyName) : false}
        value={`${propertyName}`}
        disabled={reEnroll ? false : true}
      >
        {`${labelByName[propertyName]}`}
      </FormControl>
    ));
  };

  renderForm = (formProps: IFormProps) => {
    const { reEnroll } = this.state;
    const { segment } = this.props;

    if (!segment) {
      return __('Formulář segmentu je nutné uložit');
    }

    return (
      <>
        <EnrollmentWrapper noMargin={true}>
          <b>{__('Opětovná registrace')}</b>
          <div>
            <p>
              {__(
                'To vám umožní splnit spouštěcí kritéria pro opětovnou registraci',
              )}
              .
            </p>
            <StyledToggle>
              <Toggle
                checked={reEnroll}
                onChange={this.onSwitchHandler}
                icons={{
                  checked: <span>Yes</span>,
                  unchecked: <span>No</span>,
                }}
              />
            </StyledToggle>
          </div>
        </EnrollmentWrapper>
        <p>
          {__(
            'Znovu zaregistrujte dohodu, pokud splňují spouštěcí kritéria a dojde k některé z následujících situací',
          )}
          :
        </p>
        <Checkbox>
          {segment.subSegmentConditions.map((cond) =>
            this.renderCheckbox(cond),
          )}
        </Checkbox>
      </>
    );
  };

  render() {
    return (
      <EnrollmentWrapper>
        <CommonForm renderContent={this.renderForm} />
      </EnrollmentWrapper>
    );
  }
}

export default ReEnrollment;
