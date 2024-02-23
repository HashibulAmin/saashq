import React from 'react';
import { Link } from 'react-router-dom';
// saashq
import { __ } from '@saashq/ui/src/utils/core';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import Button from '@saashq/ui/src/components/Button';
import { Title } from '@saashq/ui/src/styles/main';

type Props = {
  count: number;
};

export default function Actionbar(props: Props) {
  const renderRight = () => (
    <Link to="/pricing/plans/create">
      <Button
        type="button"
        btnStyle="success"
        icon="plus-circle"
        uppercase={false}
      >
        {__('Create a Plan')}
      </Button>
    </Link>
  );

  const renderLeft = () => <Title>Pricing plans ({props.count})</Title>;

  return <Wrapper.ActionBar left={renderLeft()} right={renderRight()} />;
}
