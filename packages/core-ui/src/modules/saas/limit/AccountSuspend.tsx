import React from 'react';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';

const WarningSign = styled.div`
  background: rgba(255, 232, 189, 1);
  border-radius: 50%;
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
`;

const AccountSuspendedMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  a {
    margin-top: 80px;
    padding: 16px 45px;
    border-radius: 10px;
  }
  p {
    color: rgba(0, 0, 0, 0.5);
    font-size: 18px;
  }
  h3 {
    color: rgba(0, 0, 0, 0.8);
  }
`;

function AccountSuspended() {
  return (
    <AccountSuspendedMessage>
      <WarningSign>
        <img src="/images/warningSign.png" />
      </WarningSign>
      <h3>Účet Pozastaven</h3>
      <p>Dosáhli jste maximálního limitu svých kontaktů.</p>
      <Button href="https://shq.saashq.org/marketplace-global">
        Přejděte na Marketplace
      </Button>
    </AccountSuspendedMessage>
  );
}

export default AccountSuspended;
