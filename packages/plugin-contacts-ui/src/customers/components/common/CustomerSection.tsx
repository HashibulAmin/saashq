import ActionSection from '@saashq/ui-contacts/src/customers/containers/ActionSection';
import CustomerSection from '@saashq/ui-contacts/src/customers/components/CustomerSection';
import { ICustomerSectionProps } from '@saashq/ui-contacts/src/customers/components/CustomerSection';
import React from 'react';

export default (props: ICustomerSectionProps) => {
  return <CustomerSection {...props} actionSection={ActionSection} />;
};
