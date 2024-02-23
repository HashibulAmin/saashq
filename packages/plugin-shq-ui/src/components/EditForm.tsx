import React, { useState } from 'react';
import { TabTitle, Tabs } from '@saashq/ui/src/components/tabs';

import General from '../containers/General';
import { IButtonMutateProps } from '@saashq/ui/src/types';
import { IShq } from '../types';
import { __ } from '@saashq/ui/src/utils';
import Appearance from '../containers/Appearance';

type Props = {
  shq: IShq;
  edit: (variables: IShq) => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

function EditFrom(props: Props) {
  const [currentTab, setCurrentTab] = useState('Mobile Gallery');

  const renderTabContent = () => {
    if (currentTab === 'Mobile Gallery') {
      return <General {...props} />;
    }

    return <Appearance {...props} renderButton={props.renderButton} />;
  };

  return (
    <>
      <Tabs full={true}>
        <TabTitle
          className={currentTab === 'Mobile Gallery' ? 'active' : ''}
          onClick={() => setCurrentTab('Mobile Gallery')}
        >
          {__('Mobile Gallery')}
        </TabTitle>
        <TabTitle
          className={currentTab === 'Web Appearance' ? 'active' : ''}
          onClick={() => setCurrentTab('Web Appearance')}
        >
          {__('Web Appearance')}
        </TabTitle>
      </Tabs>
      {renderTabContent()}
    </>
  );
}

export default EditFrom;
