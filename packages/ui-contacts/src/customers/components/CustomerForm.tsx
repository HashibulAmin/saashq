import { Alert, __, getConstantFromStore } from '@saashq/ui/src/utils';
import {
  DateContainer,
  FormColumn,
  FormWrapper,
  ModalFooter,
  ScrollWrapper,
} from '@saashq/ui/src/styles/main';
import {
  EMAIL_VALIDATION_STATUSES,
  PHONE_VALIDATION_STATUSES,
} from '../constants';
import {
  IButtonMutateProps,
  IFormProps,
  IQueryParams,
} from '@saashq/ui/src/types';
import { ICustomer, ICustomerDoc } from '../types';
import { IUser, IUserLinks } from '@saashq/ui/src/auth/types';
import { genderChoices, isValidPhone } from '../utils';

import AutoCompletionSelect from '@saashq/ui/src/components/AutoCompletionSelect';
import AvatarUpload from '@saashq/ui/src/components/AvatarUpload';
import Button from '@saashq/ui/src/components/Button';
import CollapseContent from '@saashq/ui/src/components/CollapseContent';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import DateControl from '@saashq/ui/src/components/form/DateControl';
import Form from '@saashq/ui/src/components/form/Form';
import FormControl from '@saashq/ui/src/components/form/Control';
import FormGroup from '@saashq/ui/src/components/form/Group';
import React from 'react';
import SelectTeamMembers from '@saashq/ui/src/team/containers/SelectTeamMembers';
import { isEnabled, loadDynamicComponent } from '@saashq/ui/src/utils/core';
import validator from 'validator';

type Props = {
  currentUser: IUser;
  autoCompletionQuery: string;
  customer?: ICustomer;
  closeModal: () => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  queryParams: IQueryParams;
  changeRedirectType?: (type: string) => void;
  changeVerificationStatus?: (isEmail: boolean) => void;
  fieldsVisibility: (key: string) => any; // check - IFieldsVisibility
};

type State = {
  ownerId: string;
  isSubscribed: string;
  hasAuthority: string;
  users: IUser[];
  avatar: string;
  phones?: string[];
  emails?: string[];
  primaryPhone?: string;
  birthDate: string;
  primaryEmail?: string;
  relationData?: any;
};

class CustomerForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const customer = props.customer || ({} as ICustomer);
    const userId = props.currentUser ? props.currentUser._id : '';

    this.state = {
      ownerId: customer.ownerId || userId,
      isSubscribed: customer.isSubscribed || 'Yes',
      hasAuthority: customer.hasAuthority || 'No',
      users: [],
      birthDate: customer.birthDate,
      avatar: customer.avatar,
      primaryEmail: customer.primaryEmail,
      primaryPhone: customer.primaryPhone,
    };
  }

  generateDoc = (values: { _id: string } & ICustomerDoc & IUserLinks) => {
    const { customer } = this.props;
    const finalValues = values;

    if (customer) {
      finalValues._id = customer._id;
    }

    const links = {};

    getConstantFromStore('social_links').forEach((link) => {
      links[link.value] = finalValues[link.value];
    });

    return {
      _id: finalValues._id,
      ...this.state,
      firstName: finalValues.firstName,
      lastName: finalValues.lastName,
      middleName: finalValues.middleName,
      sex: Number(finalValues.sex),
      position: finalValues.position,
      department: finalValues.department,
      leadStatus: finalValues.leadStatus,
      description: finalValues.description,
      code: finalValues.code,
      emailValidationStatus: finalValues.emailValidationStatus,
      phoneValidationStatus: finalValues.phoneValidationStatus,
      links,
      relationData: this.state.relationData,
    };
  };

  onAvatarUpload = (url) => {
    this.setState({ avatar: url });
  };

  onRelationsChange = (ids: string[], relationType: string) => {
    const { relationData = {} } = this.state;
    const key = relationType.split(':')[1];

    relationData[key] = ids;

    this.setState({ relationData });
  };

  getVisitorInfo(customer, key) {
    return customer.visitorContactInfo && customer.visitorContactInfo[key];
  }

  getEmailsOptions(customer) {
    const { emails } = customer;

    if (emails && emails.length > 0) {
      return emails;
    }

    if (this.getVisitorInfo(customer, 'email')) {
      return [this.getVisitorInfo(customer, 'email')];
    }

    return [];
  }

  getPhonesOptions(customer) {
    const { phones } = customer;

    if (phones && phones.length > 0) {
      return phones;
    }

    if (this.getVisitorInfo(customer, 'phone')) {
      return [this.getVisitorInfo(customer, 'phone')];
    }

    return [];
  }

  renderFormGroup = (label, props, type?) => {
    const { fieldsVisibility } = this.props;

    const visibility = fieldsVisibility('isVisibleInDetail');

    let name = props.name;

    if (name === 'sex') {
      name = 'pronoun';
    }

    if (name === 'ownerId') {
      name = 'owner';
    }

    if (!visibility[name] && type !== 'link') {
      return null;
    }

    if (type === 'date') {
      return (
        <FormGroup>
          <ControlLabel required={false}>{label}</ControlLabel>
          <DateContainer>
            <DateControl {...props} />
          </DateContainer>
        </FormGroup>
      );
    }

    if (type === 'selectMember') {
      return (
        <FormGroup>
          <ControlLabel>Owner</ControlLabel>
          <SelectTeamMembers {...props} />
        </FormGroup>
      );
    }

    return (
      <FormGroup>
        <ControlLabel required={props.required && true}>{label}</ControlLabel>
        <FormControl {...props} />
      </FormGroup>
    );
  };

  onEmailChange = ({ options, selectedOption }) => {
    this.setState({ emails: options, primaryEmail: selectedOption });
  };

  onPhoneChange = ({ options, selectedOption }) => {
    this.setState({ phones: options, primaryPhone: selectedOption });
  };

  onOwnerChange = (ownerId) => {
    this.setState({ ownerId });
  };

  onDateChange = (birthDate) => {
    const currentDate = new Date();
    if (currentDate > birthDate) {
      this.setState({ birthDate });
    } else {
      Alert.error('Prosím vložte správné "datum".');
    }
  };

  saveAndRedirect = (type: string) => {
    const { changeRedirectType } = this.props;

    if (changeRedirectType) {
      changeRedirectType(type);
    }
  };

  onEmailVerificationStatusChange = (e) => {
    const { changeVerificationStatus } = this.props;

    if (changeVerificationStatus) {
      changeVerificationStatus(true);
    }
  };

  onPhoneVerificationStatusChange = (e) => {
    const { changeVerificationStatus } = this.props;

    if (changeVerificationStatus) {
      changeVerificationStatus(true);
    }
  };

  hasEmail = () => {
    const customer = this.props.customer || ({} as ICustomer);

    const { emails = [] } = customer;

    return this.getVisitorInfo(customer, 'email') || emails.length > 0;
  };

  renderLink(formProps, link) {
    const { customer } = this.props;
    const links = (customer ? customer.links : {}) || {};

    return this.renderFormGroup(
      link.label,
      {
        ...formProps,
        name: link.value,
        defaultValue: links[link.value] || '',
        type: 'url',
      },
      'link',
    );
  }

  renderContent = (formProps: IFormProps) => {
    const { closeModal, renderButton, autoCompletionQuery } = this.props;
    const { values, isSubmitted, resetSubmit } = formProps;

    const customer = this.props.customer || ({} as ICustomer);
    const { primaryEmail, primaryPhone, ownerId } = customer;

    return (
      <>
        <ScrollWrapper>
          <CollapseContent
            title={__('Obecná informace')}
            compact={true}
            open={true}
          >
            <FormWrapper>
              <FormColumn>
                <AvatarUpload
                  avatar={customer.avatar}
                  onAvatarUpload={this.onAvatarUpload}
                />
              </FormColumn>
              <FormColumn>
                {this.renderFormGroup('Kód', {
                  ...formProps,
                  name: 'code',
                  defaultValue: customer.code || '',
                })}

                {this.renderFormGroup(
                  'Majitel',
                  {
                    label: 'Vyberte vlastníka',
                    name: 'ownerId',
                    initialValue: ownerId,
                    onSelect: this.onOwnerChange,
                    multi: false,
                  },
                  'selectMember',
                )}
              </FormColumn>
            </FormWrapper>
            <FormWrapper>
              <FormColumn>
                <FormGroup>
                  <ControlLabel required={true}>Jméno</ControlLabel>
                  <FormControl
                    {...formProps}
                    defaultValue={customer.firstName || ''}
                    autoFocus={true}
                    required={true}
                    name="firstName"
                  />
                </FormGroup>

                <FormGroup>
                  <ControlLabel>Prostřední Jméno</ControlLabel>
                  <FormControl
                    {...formProps}
                    name="middleName"
                    defaultValue={customer.middleName || ''}
                  />
                </FormGroup>

                <FormGroup>
                  <ControlLabel required={true}>E-mailem</ControlLabel>
                  <AutoCompletionSelect
                    required={true}
                    defaultValue={primaryEmail}
                    defaultOptions={this.getEmailsOptions(customer)}
                    autoCompletionType="emails"
                    placeholder="Zadejte e-mail"
                    queryName="customers"
                    query={autoCompletionQuery}
                    checkFormat={validator.isEmail}
                    onChange={this.onEmailChange}
                  />
                </FormGroup>

                <FormGroup>
                  <ControlLabel>Primární stav ověření e-mailu</ControlLabel>
                  <FormControl
                    {...formProps}
                    name="emailValidationStatus"
                    componentClass="select"
                    defaultValue={customer.emailValidationStatus || 'unknown'}
                    options={EMAIL_VALIDATION_STATUSES}
                  />
                </FormGroup>

                {this.renderFormGroup('Zájmeno', {
                  ...formProps,
                  name: 'sex',
                  componentClass: 'select',
                  defaultValue: customer.sex || 0,
                  options: genderChoices(__),
                })}

                {this.renderFormGroup('Oddělení', {
                  ...formProps,
                  name: 'department',
                  defaultValue: customer.department || '',
                })}

                {this.renderFormGroup('Popis', {
                  ...formProps,
                  name: 'description',
                  defaultValue: customer.description || '',
                  max: 140,
                  componentClass: 'textarea',
                })}
              </FormColumn>
              <FormColumn>
                <FormGroup>
                  <ControlLabel>Příjmení</ControlLabel>
                  <FormControl
                    {...formProps}
                    name="lastName"
                    defaultValue={customer.lastName || ''}
                  />
                </FormGroup>

                {this.renderFormGroup(
                  'Narozeniny',
                  {
                    ...formProps,
                    required: false,
                    name: 'birthDate',
                    placeholder: 'Narozeniny',
                    value: this.state.birthDate,
                    onChange: this.onDateChange,
                  },
                  'date',
                )}

                <FormGroup>
                  <ControlLabel>Telefon</ControlLabel>
                  <AutoCompletionSelect
                    defaultValue={primaryPhone}
                    defaultOptions={this.getPhonesOptions(customer)}
                    autoCompletionType="phones"
                    placeholder="Zadejte telefon"
                    queryName="customers"
                    query={autoCompletionQuery}
                    checkFormat={isValidPhone}
                    onChange={this.onPhoneChange}
                  />
                </FormGroup>

                <FormGroup>
                  <ControlLabel>Stav primárního ověření telefonu</ControlLabel>
                  <FormControl
                    {...formProps}
                    name="phoneValidationStatus"
                    componentClass="select"
                    defaultValue={customer.phoneValidationStatus || 'unknown'}
                    options={PHONE_VALIDATION_STATUSES}
                  />
                </FormGroup>

                {this.renderFormGroup('Pozice', {
                  ...formProps,
                  name: 'position',
                  defaultValue: customer.position || '',
                })}

                {this.renderFormGroup('Má Autoritu', {
                  ...formProps,
                  name: 'hasAuthority',
                  componentClass: 'radio',
                  options: [
                    {
                      childNode: 'Yes',
                      value: 'Yes',
                      checked: this.state.hasAuthority === 'Yes',
                      onChange: (e) =>
                        this.setState({ hasAuthority: e.target.value }),
                    },
                    {
                      childNode: 'No',
                      value: 'No',
                      checked: this.state.hasAuthority === 'No',
                      onChange: (e) =>
                        this.setState({ hasAuthority: e.target.value }),
                    },
                  ],
                })}

                {this.renderFormGroup('Odebíráno', {
                  ...formProps,
                  name: 'isSubscribed',
                  componentClass: 'radio',
                  options: [
                    {
                      childNode: 'Yes',
                      value: 'Yes',
                      checked: this.state.isSubscribed === 'Yes',
                      onChange: (e) =>
                        this.setState({ isSubscribed: e.target.value }),
                    },
                    {
                      childNode: 'No',
                      value: 'No',
                      checked: this.state.isSubscribed === 'No',
                      onChange: (e) =>
                        this.setState({ isSubscribed: e.target.value }),
                    },
                  ],
                })}
              </FormColumn>
            </FormWrapper>
          </CollapseContent>
          <CollapseContent title={__('Odkazy')} compact={true}>
            <FormWrapper>
              <FormColumn>
                {getConstantFromStore('social_links').map((link) =>
                  this.renderLink(formProps, link),
                )}
              </FormColumn>
            </FormWrapper>
          </CollapseContent>
          {isEnabled('forms') && (
            <CollapseContent title={__('Vztahy')} compact={true}>
              <FormWrapper>
                <FormColumn>
                  {!this.props.customer &&
                    loadDynamicComponent('relationForm', {
                      ...this.props,
                      onChange: this.onRelationsChange,
                      contentType: 'contacts:customer',
                    })}
                </FormColumn>
              </FormWrapper>
            </CollapseContent>
          )}
        </ScrollWrapper>
        <ModalFooter>
          <Button
            btnStyle="simple"
            uppercase={false}
            onClick={closeModal}
            icon="times-circle"
          >
            Zavřít
          </Button>

          {renderButton({
            passedName: customer.state || 'customer',
            values: this.generateDoc(values),
            isSubmitted,
            object: this.props.customer,
            resetSubmit,
          })}

          {!this.props.customer && (
            <>
              <Button
                btnStyle="primary"
                type="submit"
                uppercase={false}
                icon="user-square"
                onClick={this.saveAndRedirect.bind(this, 'detail')}
                disabled={isSubmitted}
              >
                Uložit a Zobrazit
              </Button>
              <Button
                type="submit"
                uppercase={false}
                onClick={this.saveAndRedirect.bind(this, 'new')}
                disabled={isSubmitted}
                icon="user-plus"
              >
                Uložit & Nový
              </Button>
            </>
          )}
        </ModalFooter>
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default CustomerForm;
