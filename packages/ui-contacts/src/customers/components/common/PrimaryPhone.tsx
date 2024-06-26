import Icon from '@saashq/ui/src/components/Icon';
import Tip from '@saashq/ui/src/components/Tip';
import colors from '@saashq/ui/src/styles/colors';
import React from 'react';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';

const CallTo = styled.a`
  display: flex;
  align-items: center;

  span {
    margin-left: 5px;
  }
`;

const Status = styledTS<{ verified: boolean }>(styled.span)`
  background: ${(props) =>
    props.verified ? colors.colorCoreGreen : colors.bgGray};
  color: ${(props) =>
    props.verified ? colors.colorWhite : colors.textSecondary};
  width: 18px;
  height: 18px;
  text-align: center;
  border-radius: 9px;
  font-size: 11px;
  line-height: 18px;
`;

const statuses = {
  valid: {
    icon: 'shield-check',
    label: 'Platný',
    verified: true,
  },
  invalid: {
    icon: 'shield-slash',
    label: 'Neplatný',
    verified: false,
  },
  receives_sms: {
    icon: 'comment-alt-message',
    label: 'Může přijímat SMS',
    verified: true,
  },
  unknown: {
    icon: 'lock',
    label: 'Neznámý',
    verified: false,
  },
  unverifiable: {
    icon: 'ban',
    label: 'Neověřitelné',
    verified: false,
  },
  accept_all_unverifiable: {
    icon: 'ban',
    label: 'Neověřitelné',
    verified: false,
  },
};

function PrimaryPhone({ phone, status }: { phone?: string; status?: string }) {
  const renderStatus = () => {
    if (status && statuses[status]) {
      return (
        <Tip text={`Postavení: ${statuses[status].label}`} placement="top">
          <Status verified={statuses[status].verified}>
            <Icon icon={statuses[status].icon} />
          </Status>
        </Tip>
      );
    }
    return null;
  };

  return (
    <>
      {phone ? (
        <CallTo href={`tel:${phone}`}>
          {phone}
          {renderStatus()}
        </CallTo>
      ) : (
        '-'
      )}
    </>
  );
}

export default PrimaryPhone;
