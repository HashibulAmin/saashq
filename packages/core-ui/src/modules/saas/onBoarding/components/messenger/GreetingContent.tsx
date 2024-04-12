import React from 'react';
import dayjs from 'dayjs';
import Form from 'react-bootstrap/Form';
import Icon from 'modules/common/components/Icon';
import { __ } from 'modules/common/utils';
import {
  ContentBox,
  SaasHQContent,
  LeftSide,
  RightSide,
  TextContainer,
} from 'modules/saas/onBoarding/styles';

type Props = {
  color?: string;
};

function GreetingContent(props: Props) {
  return (
    <SaasHQContent isTabbed={true}>
      <ContentBox>
        <h4>{__('Nedávné rozhovory')}</h4>
        <ul>
          <li>
            <LeftSide>
              <span>
                <Icon icon="plus" />
              </span>
            </LeftSide>
            <RightSide>
              <span>{__('Začněte novou konverzaci')}</span>
              <p>Naše obvyklá doba odezvy</p>
              <p> {'Pár minut'}</p>
            </RightSide>
          </li>
          <li>
            <LeftSide>
              <img src="/images/avatar-colored.svg" alt="avatar" />
            </LeftSide>
            <RightSide>
              <div>{dayjs(new Date()).format('LT')}</div>
              <span>{__('Uživatel')}</span>
              <p>{__('Potřebujeme tvou pomoc!')}</p>
            </RightSide>
          </li>
        </ul>
      </ContentBox>

      <ContentBox>
        <h4>{__('Chcete se dozvědět více??')}</h4>

        <Form.Group>
          <Form.Control
            name="firstName"
            placeholder="Zadejte svou e-mailovou adresu:"
            disabled={true}
          />
        </Form.Group>
      </ContentBox>

      <TextContainer>
        <h3>Powered by SaasHQ</h3>
      </TextContainer>
    </SaasHQContent>
  );
}

export default GreetingContent;
