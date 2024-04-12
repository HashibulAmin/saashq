import Button from 'modules/common/components/Button';
import Icon from 'modules/common/components/Icon';
import { __ } from 'modules/common/utils';
import * as React from 'react';
import styled from 'styled-components';
import { NavButton } from './styles';

const Wrapper = styled.div`
  width: 280px;
  display: flex;
  margin: 0;

  > span {
    margin-right: 10px;
  }

  h3 {
    margin: 4px 30px 10px 0;
    font-size: 16px;
  }

  p {
    margin-bottom: 16px;
  }
`;

type Props = {
  onResumeClick: () => void;
  currentUserName: string;
  forceComplete: () => void;
  toggleContent: (isShow: boolean) => void;
};

export default function Suggestion({
  onResumeClick,
  currentUserName,
  forceComplete,
  toggleContent,
}: Props) {
  const onHide = () => {
    toggleContent(false);
  };

  return (
    <>
      <NavButton onClick={onHide} right={true}>
        <Icon icon="times" size={17} />
      </NavButton>
      <Wrapper>
        <span role="img" aria-label="Wave">
          👋
        </span>
        <div>
          <h3>
            {__('Ahoj')}, <b>{currentUserName}</b>
          </h3>
          <p>
            {`${__('Nemáte úplnou konfiguraci')}.${__('Chcete konfigurovat')}`}
          </p>

          <Button
            btnStyle="success"
            size="small"
            onClick={onResumeClick}
            uppercase={true}
          >
            {__('Životopis')}
          </Button>
          <Button
            btnStyle="link"
            size="small"
            onClick={forceComplete}
            uppercase={true}
          >
            {__('Už nikdy nevidět')}
          </Button>
        </div>
      </Wrapper>
    </>
  );
}
