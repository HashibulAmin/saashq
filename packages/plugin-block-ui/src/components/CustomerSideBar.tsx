import React, { useState } from 'react';
import { __ } from 'coreui/utils';
import Box from '@saashq/ui/src/components/Box';
import FormGroup from '@saashq/ui/src/components/form/Group';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import FormControl from '@saashq/ui/src/components/form/Control';
import Button from '@saashq/ui/src/components/Button';
import Select from 'react-select-plus';
import { List } from '../styles';

type Props = {
  id: string;
  getBalance: number;
  verified: string;
  addBalance: (saashqCustomerId: string, amount: number) => void;
  updateVerify: (saashqCustomerId: string, isVerified: string) => void;
};

function CustomerSideBar({
  id,
  getBalance,
  verified,
  addBalance,
  updateVerify,
}: Props) {
  const [balance, SetBalance] = useState(0);
  const [verify, SetVerify] = useState(verified);

  const onChangeBalance = (e) => {
    SetBalance(Number(e.target.value));
  };

  const onVerifyChange = (option) => {
    const value = option ? option.value : '';

    SetVerify(value);
  };

  const handleSubmitBalance = () => {
    addBalance(id, balance);
  };

  const handleSubmitVerify = () => {
    updateVerify(id, verify);
  };

  return (
    <Box title={__('Block')} name="showOthers">
      <FormGroup>
        <ControlLabel>{__('Zůstatek')}</ControlLabel>
        <FormControl
          type="number"
          defaultValue={balance}
          onChange={onChangeBalance}
        />
      </FormGroup>
      <Button btnStyle="success" onClick={handleSubmitBalance}>
        Submit
      </Button>
      <FormGroup>
        <ControlLabel>{__('Ověřte')}</ControlLabel>
        <Select
          value={verify}
          onChange={onVerifyChange}
          options={[
            {
              label: 'Skutečný',
              value: 'true',
            },
            {
              label: 'Nepravdivé',
              value: 'false',
            },
            {
              label: 'Načítání',
              value: 'loading',
            },
          ]}
          clearable={false}
        />
      </FormGroup>
      <Button btnStyle="success" onClick={handleSubmitVerify}>
        Submit
      </Button>
      <List>
        <li>
          <div>{__('Celková Rovnováha')}: </div> <span>{getBalance}</span>
        </li>
      </List>
    </Box>
  );
}

export default CustomerSideBar;
