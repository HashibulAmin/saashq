import React from 'react';
// saashq
import { __ } from '@saashq/ui/src/utils';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
// local
import Form from '../containers/plan/Form';
import { SUBMENU } from '../constants';

const PlanEdit = () => {
  return (
    <Wrapper
      header={<Wrapper.Header title={__('Edit a Plan')} submenu={SUBMENU} />}
      content={<Form />}
      transparent
    />
  );
};

export default PlanEdit;
