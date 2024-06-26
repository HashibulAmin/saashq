import React, { useState } from 'react';
import { Tab, TabContent, TabsContainer } from '../styles';

import ContactsContainer from '../containers/Contacts';
import HistoryContainer from '../containers/History';
import { Icon } from '@saashq/ui/src/components';
import KeyPadContainer from '../containers/KeyPad';
import { __ } from '@saashq/ui/src/utils';
import { ICallConfigDoc } from '../types';
import { callPropType } from '../lib/types';
import { extractPhoneNumberFromCounterpart } from '../utils';

type Props = {
  autoOpenTab: string;
  callUserIntegrations?: ICallConfigDoc[];
  setConfig?: any;
};

const WidgetPopover = (
  { autoOpenTab, callUserIntegrations, setConfig }: Props,
  context,
) => {
  const phone = extractPhoneNumberFromCounterpart(context?.call?.counterpart);
  const [currentTab, setCurrentTab] = useState(autoOpenTab || 'Keyboard');
  const [phoneNumber, setPhoneNumber] = useState(phone || '');

  const onTabClick = (newTab) => {
    setCurrentTab(newTab);
  };

  const changeTab = (number, tab) => {
    setCurrentTab(tab);
    setPhoneNumber(number);
  };

  const historyOnClick = () => {
    onTabClick('History');
  };

  const keyboardOnClick = () => {
    onTabClick('Keyboard');
  };

  const contactsOnClick = () => {
    onTabClick('Contact');
  };

  const renderContent = () => {
    if (currentTab === 'History') {
      return <HistoryContainer changeMainTab={changeTab} />;
    }

    if (currentTab === 'Contact') {
      return <ContactsContainer changeMainTab={changeTab} />;
    }

    return (
      <KeyPadContainer
        callUserIntegrations={callUserIntegrations}
        setConfig={setConfig}
        phoneNumber={phoneNumber}
      />
    );
  };

  return (
    <>
      <TabContent>{renderContent()}</TabContent>
      <TabsContainer full={true}>
        <Tab
          className={currentTab === 'History' ? 'active' : ''}
          onClick={historyOnClick}
        >
          <Icon icon="history" size={20} />
          {__('Dějiny')}
        </Tab>
        <Tab
          className={currentTab === 'Keyboard' ? 'active' : ''}
          onClick={keyboardOnClick}
        >
          <Icon icon="keyboard-alt" size={20} />
          {__('Klávesnice')}
        </Tab>
        <Tab
          className={currentTab === 'Contact' ? 'active' : ''}
          onClick={contactsOnClick}
        >
          <Icon icon="book" size={18} />
          {__('Kontakt')}
        </Tab>
      </TabsContainer>
    </>
  );
};

WidgetPopover.contextTypes = {
  call: callPropType,
};

export default WidgetPopover;
