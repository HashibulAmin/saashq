import DetailInfo from '@saashq/ui-contacts/src/customers/components/common/DetailInfo';
import { ICustomer } from '../../types';
import { IField } from '@saashq/ui/src/types';
import { IFieldsVisibility } from '@saashq/ui-contacts/src/customers/types';
import React from 'react';
import Sidebar from '@saashq/ui/src/layout/components/Sidebar';

type Props = {
  customer: ICustomer;
  fieldsVisibility: (key: string) => IFieldsVisibility;
  fields: IField[];
};

class BasicInfo extends React.Component<Props> {
  render() {
    const { Section } = Sidebar;

    const { customer, fieldsVisibility, fields } = this.props;

    return (
      <Section>
        <DetailInfo
          customer={customer}
          fieldsVisibility={fieldsVisibility}
          hasPosition={true}
          isDetail={true}
          fields={fields}
        />
      </Section>
    );
  }
}

export default BasicInfo;
