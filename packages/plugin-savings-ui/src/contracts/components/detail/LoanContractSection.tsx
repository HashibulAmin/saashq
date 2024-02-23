import React from 'react';

import Box from '@saashq/ui/src/components/Box';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import Icon from '@saashq/ui/src/components/Icon';
import { SectionBodyItem } from '@saashq/ui/src/layout/styles';
import { __ } from 'coreui/utils';
import { Link } from 'react-router-dom';

interface Props {
  loanContracts?: [{ _id: string; number: string }];
}

function LoanContractSection({ loanContracts }: Props) {
  const content = (
    <>
      {loanContracts?.map((contract, index) => (
        <SectionBodyItem key={contract._id}>
          <Link to={`/saashq-plugin-loan/contract-details/${contract._id}`}>
            <Icon icon="arrow-to-right" style={{ marginRight: 5 }} />
            <span>{contract.number || 'Unknown'}</span>
          </Link>
        </SectionBodyItem>
      ))}
      {!loanContracts?.length && (
        <EmptyState icon="building" text="No contract" />
      )}
    </>
  );

  return (
    <Box title={__(`${'Loan Contracts'}`)} name="showContracts" isOpen={true}>
      {content}
    </Box>
  );
}

export default LoanContractSection;
