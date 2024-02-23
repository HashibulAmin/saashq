import { ControlLabel, Form } from '@saashq/ui/src/components/form';
import { IFormProps } from '@saashq/ui/src/types';
import { IClientPortalUser } from '../../types';
import React, { useState } from 'react';

import Button from '@saashq/ui/src/components/Button';
import FormGroup from '@saashq/ui/src/components/form/Group';
import { FlexCenter, ModalFooter } from '@saashq/ui/src/styles/main';
import { Alert } from '@saashq/ui/src/utils';
import SelectCompanies from '@saashq/ui-contacts/src/companies/containers/SelectCompanies';
import { __ } from '@saashq/ui/src/utils';
type Props = {
  clientPortalUser: IClientPortalUser;
  assignCompany: (
    userId: string,
    saashqCompanyId: string,
    saashqCustomerId: string
  ) => void;
  queryParams: any;
};

const CompanyAssignForm = (props: Props) => {
  const { clientPortalUser, assignCompany, queryParams } = props;

  const getUserSaasHQCompanyId =
    clientPortalUser && clientPortalUser.saashqCompanyId
      ? clientPortalUser.saashqCompanyId
      : '';

  const [companyId, setCompanyId] = useState(getUserSaasHQCompanyId);

  const onSave = () => {
    if (!companyId.length) {
      Alert.error('Please choose a company to assign');
      return;
    }
    assignCompany(
      clientPortalUser._id,
      companyId,
      clientPortalUser.saashqCustomerId
    );
  };

  const onSelect = saashqCompanyId => {
    setCompanyId(saashqCompanyId);
  };

  const renderContent = (formProps: IFormProps) => {
    return (
      <>
        <ControlLabel>
          {clientPortalUser && (clientPortalUser.companyName || '')}
        </ControlLabel>
        <SelectCompanies
          initialValue={getUserSaasHQCompanyId}
          label={__('Select a company to assign')}
          name="companyIds"
          onSelect={onSelect}
          multi={false}
        />
        <ModalFooter>
          <Button btnStyle="success" type="button" onClick={onSave}>
            Save
          </Button>
        </ModalFooter>
      </>
    );
  };

  return <Form renderContent={renderContent} />;
};

export default CompanyAssignForm;
