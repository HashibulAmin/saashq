import {
  FieldStyle,
  SidebarCounter,
  SidebarFlexRow,
  SidebarList,
} from '@saashq/ui/src/layout/styles';

import { ICompany } from '@saashq/ui-contacts/src/companies/types';
import { IField } from '@saashq/ui/src/types';
import React from 'react';
import { __ } from '@saashq/ui/src/utils';

type Props = {
  company: ICompany;
  fields: IField[];
};

class DetailInfo extends React.Component<Props> {
  renderRow = (field, value) => {
    const { fields = [] } = this.props;

    const property = fields.find((e) => e.type === field);

    if (property && !property.isVisible) {
      return null;
    }

    const label = property && property.text;
    const className = field === 'industry' ? 'multiple-choice' : '';

    return (
      <li className={className}>
        <FieldStyle>{__(`${label}`)}</FieldStyle>
        <SidebarCounter>{value || '-'}</SidebarCounter>
      </li>
    );
  };

  renderParentCompany(parentCompany?: string) {
    return (
      <li>
        <FieldStyle>{__('Mateřská společnost')}:</FieldStyle>
        <SidebarCounter>{parentCompany || '-'}</SidebarCounter>
      </li>
    );
  }

  renderDescription(description?: string) {
    const { fields = [] } = this.props;

    const descriptionField = fields.find((e) => e.type === 'description');

    if (descriptionField && !descriptionField.isVisible) {
      return null;
    }

    return (
      <SidebarFlexRow>
        {descriptionField && descriptionField.isVisible}
        {__(`Popis`)}:<span>{description || '-'}</span>
      </SidebarFlexRow>
    );
  }

  render() {
    const { company = {} as ICompany } = this.props;

    return (
      <SidebarList className="no-link">
        {this.renderRow('kód', company.code)}
        {this.renderRow('velikost', company.size)}
        {this.renderRow('průmysl', company.industry)}
        {this.renderParentCompany(
          company.parentCompany ? company.parentCompany.primaryName : '-',
        )}
        {this.renderRow('Primární email', company.primaryEmail)}
        {this.renderRow(
          'majitel',
          company.owner && company.owner.details
            ? company.owner.details.fullName
            : '-',
        )}
        {this.renderRow('hlavní telefon', company.primaryPhone)}
        {this.renderRow('umístění', company.location)}
        {this.renderRow('obchodní typ', company.businessType)}
        {this.renderRow('je Předplaceno', company.isSubscribed)}
        {this.renderRow('skóre', company.score)}
        {this.renderDescription(company.description)}
      </SidebarList>
    );
  }
}

export default DetailInfo;
