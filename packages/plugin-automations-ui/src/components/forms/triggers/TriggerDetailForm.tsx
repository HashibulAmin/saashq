import React, { useEffect, useState } from 'react';
import { ITrigger } from '../../../types';
import SegmentsForm from '@saashq/ui-segments/src/containers/form/SegmentsForm';
import { Description, FlexContainer, TriggerTabs } from '../../../styles';
import { ScrolledContent } from '@saashq/ui-automations/src/styles';
import { __ } from '@saashq/ui/src';
import { Tabs, TabTitle } from '@saashq/ui/src/components/tabs';
import ReEnrollmentContainer from '../../../containers/forms/triggers/ReEnrollment';
import { Button, ModalTrigger } from '@saashq/ui/src';
import DateSettings from './subForms/Date';
import { ModalFooter } from '@saashq/ui/src/styles/main';
import { renderDynamicComponent } from '../../../utils';

type Props = {
  closeModal: () => void;
  activeTrigger: ITrigger;
  triggerConst: ITrigger;
  contentId?: string;
  addConfig: (trigger: ITrigger, id?: string, config?: any) => void;
};

function TriggerDetailForm(props: Props) {
  const { closeModal, contentId, addConfig, triggerConst } = props;

  const [currentTab, setCurrentTab] = useState('');
  const [activeTrigger, setActiveTrigger] = useState(props.activeTrigger || {});

  const { config = {} } = activeTrigger;

  useEffect(() => {
    setActiveTrigger(props.activeTrigger);
  }, [props.activeTrigger]);

  const tabOnClick = (currentTab: string) => {
    setCurrentTab(currentTab);
  };

  const renderContent = () => {
    if (currentTab === 'reenrollment') {
      return (
        <ReEnrollmentContainer
          segmentId={config.contentId}
          trigger={activeTrigger}
          closeModal={closeModal}
          addConfig={addConfig}
        />
      );
    }

    return (
      <SegmentsForm
        {...props}
        contentType={activeTrigger.type}
        closeModal={closeModal}
        id={config.contentId}
        hideDetailForm={true}
      />
    );
  };

  const renderSettings = () => {
    const onChange = (config) => {
      activeTrigger.config = config;
      addConfig(activeTrigger, activeTrigger.id, config);
    };

    const onClear = () => {
      const { contentId, reEnrollment, reEnrollmentRules } =
        activeTrigger?.config || {};

      activeTrigger.config = { contentId, reEnrollment, reEnrollmentRules };
      addConfig(activeTrigger, activeTrigger.id);
    };

    const trigger = <Button icon="settings" btnStyle="link" />;

    const content = () => {
      return (
        <>
          <DateSettings onChange={onChange} config={config} />
          <ModalFooter>
            <Button btnStyle="simple" onClick={onClear}>
              {__('Průhledná')}
            </Button>
          </ModalFooter>
        </>
      );
    };

    return (
      <ModalTrigger
        title="Nastavení Spouštění"
        trigger={trigger}
        content={content}
        hideHeader={true}
      />
    );
  };

  if (triggerConst.isCustom) {
    let Component = renderDynamicComponent(
      {
        ...props,
        componentType: 'triggerForm',
      },
      activeTrigger.type,
    );

    if (Component) {
      return Component;
    }

    return null;
  }

  return (
    <>
      <Description>
        <FlexContainer>
          <h4>
            {activeTrigger.label} {__('na základě')}
          </h4>
          {renderSettings()}
        </FlexContainer>
        <p>{activeTrigger.description}</p>
      </Description>
      <TriggerTabs>
        <Tabs full={true}>
          <TabTitle
            className={currentTab === 'new' ? 'active' : ''}
            onClick={tabOnClick.bind(this, 'new')}
          >
            {__('Nová spoušť')}
          </TabTitle>
          <TabTitle
            className={currentTab === 'reenrollment' ? 'active' : ''}
            onClick={tabOnClick.bind(this, 'reenrollment')}
          >
            {__('Opětovná registrace')}
          </TabTitle>
        </Tabs>
      </TriggerTabs>
      <ScrolledContent>{renderContent()}</ScrolledContent>
    </>
  );
}

export default TriggerDetailForm;
