import React from 'react';
// saashq
import { __ } from '@saashq/ui/src/utils';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
// local
import Form from '../containers/plan/Form';
import { SUBMENU } from '../constants';

const PlanCreate = () => {
  return (
    <Wrapper
      header={<Wrapper.Header title={__('Create a Plan')} submenu={SUBMENU} />}
      content={<Form />}
      transparent
    />
  );
};

export default PlanCreate;
