import {
  COMPANY_BUSINESS_TYPES,
  COMPANY_INDUSTRY_TYPES,
  COUNTRIES,
} from '../constants';
import {
  FormColumn,
  FormWrapper,
  ModalFooter,
  ScrollWrapper,
} from '@saashq/ui/src/styles/main';
import { IButtonMutateProps, IFormProps } from '@saashq/ui/src/types';
import { ICompany, ICompanyDoc, ICompanyLinks } from '../types';
import { __, getConstantFromStore } from '@saashq/ui/src/utils';

import AutoCompletionSelect from '@saashq/ui/src/components/AutoCompletionSelect';
import AvatarUpload from '@saashq/ui/src/components/AvatarUpload';
import Button from '@saashq/ui/src/components/Button';
import CollapseContent from '@saashq/ui/src/components/CollapseContent';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import Form from '@saashq/ui/src/components/form/Form';
import FormControl from '@saashq/ui/src/components/form/Control';
import FormGroup from '@saashq/ui/src/components/form/Group';
import { IUser } from '@saashq/ui/src/auth/types';
import React from 'react';
import Select from 'react-select-plus';
import SelectCompanies from '../containers/SelectCompanies';
import SelectTeamMembers from '@saashq/ui/src/team/containers/SelectTeamMembers';
import { isValidPhone } from '@saashq/ui-contacts/src/customers/utils';
import validator from 'validator';
import { isEnabled, loadDynamicComponent } from '@saashq/ui/src/utils/core';

type Props = {
  currentUser: IUser;
  autoCompletionQuery: string;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  company: ICompany;
  closeModal: () => void;
};

type State = {
  parentCompanyId?: string;
  ownerId?: string;
  companies?: ICompany[];
  isSubscribed?: string;
  users?: IUser[];
  avatar?: string;

  names?: string[];
  emails?: string[];
  phones?: string[];
  primaryName?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  industry?: string[];
  businessType?: string;
  location?: string;
  relationData?: any;
};

class CompanyForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const { company = {} } = props;
    const companies: ICompany[] = [];
    const userId = props.currentUser ? props.currentUser._id : '';

    if (company.parentCompany) {
      companies.push(company.parentCompany);
    }

    this.state = {
      parentCompanyId: company.parentCompanyId || '',
      ownerId: company.ownerId || userId,
      companies,
      isSubscribed: company.isSubscribed || 'Yes',
      users: [],
      avatar: company.avatar,
      industry: company.industry || '',
      businessType: company.businessType || '',
      location: company.location || '',
    };
  }

  generateDoc = (
    values: { _id: string; size?: number } & ICompanyDoc & ICompanyLinks,
  ) => {
    const { company } = this.props;
    const { industry } = this.state;

    const finalValues = values;

    if (company) {
      finalValues._id = company._id;
    }

    const links = {};

    getConstantFromStore('social_links').forEach((link) => {
      links[link.value] = finalValues[link.value];
    });

    return {
      _id: finalValues._id,
      ...this.state,
      size: Number(finalValues.size),
      description: finalValues.description,
      code: finalValues.code,
      links,
      industry: industry && industry.toString(),
    };
  };

  onAvatarUpload = (url: string) => {
    this.setState({ avatar: url });
  };

  onRelationsChange = (ids: string[], relationType: string) => {
    const { relationData = {} } = this.state;
    const key = relationType.split(':')[1];

    relationData[key] = ids;

    this.setState({ relationData });
  };

  generateConstantParams(constants) {
    return constants.map((constant) => ({
      value: constant,
      label: constant,
    }));
  }

  handleSelect = <T extends keyof State>(selectedOption: string, name: T) => {
    this.setState({
      [name]: selectedOption,
    } as Pick<State, keyof State>);
  };

  renderFormGroup = (label, props) => {
    return (
      <FormGroup key={label}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
      </FormGroup>
    );
  };

  onIndustryChange = (option) => {
    this.setState({ industry: option.map((item) => item.value) || [] });
  };

  onBusinessChange = (option) => {
    this.setState({ businessType: option.value });
  };

  onCountryChange = (option) => {
    this.setState({ location: option.value });
  };

  onChange = (
    optionsName: string,
    optionName: string,
    { options, selectedOption }: { options: string[]; selectedOption: string },
  ) => {
    this.setState({ [optionsName]: options, [optionName]: selectedOption });
  };

  renderLink(formProps, link) {
    const { company } = this.props;
    const links = (company ? company.links : {}) || {};

    return this.renderFormGroup(link.label, {
      ...formProps,
      name: link.value,
      defaultValue: links[link.value] || '',
      type: 'url',
    });
  }

  renderContent = (formProps: IFormProps) => {
    const company = this.props.company || ({} as ICompany);
    const { closeModal, renderButton, autoCompletionQuery } = this.props;
    const { values, isSubmitted } = formProps;

    const {
      primaryName,
      names,
      primaryPhone,
      phones,
      primaryEmail,
      ownerId,
      emails,
    } = company;

    const { parentCompanyId } = this.state;

    const onSelectOwner = (value) => {
      return this.handleSelect(value, 'ownerId');
    };

    const onSelectParentCompany = (value) => {
      return this.handleSelect(value, 'parentCompanyId');
    };

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
                  avatar={company.avatar}
                  onAvatarUpload={this.onAvatarUpload}
                  defaultAvatar="/images/integrations/company.png"
                />
              </FormColumn>

              <FormColumn>
                {this.renderFormGroup('Kód', {
                  ...formProps,
                  name: 'code',
                  defaultValue: company.code || '',
                })}

                <FormGroup>
                  <ControlLabel>Majitel</ControlLabel>
                  <SelectTeamMembers
                    label="Vyberte vlastníka"
                    name="ownerId"
                    initialValue={ownerId}
                    onSelect={onSelectOwner}
                    multi={false}
                  />
                </FormGroup>
              </FormColumn>
            </FormWrapper>
            <FormWrapper>
              <FormColumn>
                <FormGroup>
                  <ControlLabel required={true}>Název</ControlLabel>
                  <AutoCompletionSelect
                    required={true}
                    defaultValue={primaryName}
                    defaultOptions={names || []}
                    autoCompletionType="names"
                    placeholder="Zadejte název společnosti"
                    queryName="companies"
                    query={autoCompletionQuery}
                    onChange={this.onChange.bind(this, 'names', 'primaryName')}
                  />
                </FormGroup>

                <FormGroup>
                  <ControlLabel>Průmyslová odvětví</ControlLabel>
                  <Select
                    value={this.state.industry}
                    onChange={this.onIndustryChange}
                    options={this.generateConstantParams(
                      COMPANY_INDUSTRY_TYPES(),
                    )}
                    multi={true}
                    clearable={false}
                  />
                </FormGroup>

                <FormGroup>
                  <ControlLabel>E-mailem</ControlLabel>
                  <AutoCompletionSelect
                    defaultValue={primaryEmail}
                    defaultOptions={emails || []}
                    autoCompletionType="emails"
                    placeholder="Zadejte firemní email"
                    queryName="companies"
                    query={autoCompletionQuery}
                    onChange={this.onChange.bind(
                      this,
                      'emails',
                      'primaryEmail',
                    )}
                    checkFormat={validator.isEmail}
                  />
                </FormGroup>

                <FormGroup>
                  <ControlLabel>Popis</ControlLabel>
                  <FormControl
                    {...formProps}
                    max={140}
                    name="description"
                    componentClass="textarea"
                    defaultValue={company.description || ''}
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Země ústředí</ControlLabel>
                  <Select
                    value={this.state.location}
                    onChange={this.onCountryChange}
                    options={this.generateConstantParams(COUNTRIES)}
                    placeholder={__('Vyberte zemi')}
                    clearable={true}
                  />
                </FormGroup>
              </FormColumn>
              <FormColumn>
                <FormGroup>
                  <ControlLabel>Mateřská společnost</ControlLabel>
                  <SelectCompanies
                    label="Vyberte mateřskou společnost"
                    name="parentCompanyId"
                    initialValue={parentCompanyId}
                    onSelect={onSelectParentCompany}
                    multi={false}
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Typ Podnikání</ControlLabel>
                  <Select
                    value={this.state.businessType}
                    onChange={this.onBusinessChange}
                    options={this.generateConstantParams(
                      COMPANY_BUSINESS_TYPES,
                    )}
                    placeholder={__('Vybrat')}
                    clearable={false}
                  />
                </FormGroup>

                <FormGroup>
                  <ControlLabel>Telefon</ControlLabel>
                  <AutoCompletionSelect
                    defaultValue={primaryPhone}
                    defaultOptions={phones || []}
                    autoCompletionType="phones"
                    placeholder="Zadejte firemní telefon"
                    queryName="companies"
                    query={autoCompletionQuery}
                    onChange={this.onChange.bind(
                      this,
                      'phones',
                      'primaryPhone',
                    )}
                    checkFormat={isValidPhone}
                  />
                </FormGroup>

                {this.renderFormGroup('Size', {
                  ...formProps,
                  name: 'size',
                  type: 'number',
                  defaultValue: company.size || 0,
                })}

                {this.renderFormGroup('Subscribed', {
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
          <CollapseContent title={__('Odkazy')} compact={true} open={true}>
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
                  {!this.props.company &&
                    loadDynamicComponent('relationForm', {
                      ...this.props,
                      onChange: this.onRelationsChange,
                      contentType: 'contacts:company',
                    })}
                </FormColumn>
              </FormWrapper>
            </CollapseContent>
          )}
        </ScrollWrapper>

        <ModalFooter>
          <Button btnStyle="simple" onClick={closeModal} icon="cancel-1">
            Zavřít
          </Button>

          {renderButton({
            name: 'company',
            values: this.generateDoc(values),
            isSubmitted,
            object: this.props.company,
          })}
        </ModalFooter>
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default CompanyForm;
