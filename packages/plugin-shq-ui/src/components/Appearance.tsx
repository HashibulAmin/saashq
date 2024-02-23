import {
  AppearanceWrapper,
  Colors,
  FeatureRow,
  FeatureRowItem,
  GeneralWrapper,
  Logos,
  TeamPortal
} from '../styles';
import { ColorPick, ColorPicker } from '../styles';
import React, { useState } from 'react';
import Select from 'react-select-plus';

import Button from '@saashq/ui/src/components/Button';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import { FormControl } from '@saashq/ui/src/components/form';
import { IButtonMutateProps, ISelectedOption } from '@saashq/ui/src/types';
import { IShq } from '../types';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import TwitterPicker from 'react-color/lib/Twitter';
import Uploader from '@saashq/ui/src/components/Uploader';
import VisionStructureForm from './VisionStructureForm';
import { __ } from '@saashq/ui/src/utils';
import { IBoard, IPipeline } from '@saashq/ui-cards/src/boards/types';
import { ITopic } from '@saashq/ui-knowledgebase/src/types';

type Props = {
  shq: IShq;
  edit: (variables: IShq) => void;
  kbTopics: ITopic[];
  boards: IBoard[];
  pipelines: IPipeline[];
  fetchPipelines: (boardId: string) => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

export default function Appearance(props: Props) {
  const {
    shq,
    kbTopics,
    boards,
    pipelines,
    edit,
    fetchPipelines,
    renderButton
  } = props;

  const shqLogo = shq.logo;
  const shqFavicon = shq.favicon;
  const shqAppearance = shq.appearance;
  const [logo, setLogo] = useState(shqLogo);
  const [favicon, setFavicon] = useState(shqFavicon);
  const [url, setUrl] = useState(shq.url || '');
  const [webName, setWebName] = useState(shq.webName || '');
  const [webDescription, setWebDescription] = useState(
    shq.webDescription || ''
  );
  const [knowledgeBaseLabel, setKnowledgeBaseLabel] = useState(
    shq.knowledgeBaseLabel || ''
  );
  const [knowledgeBaseTopicId, setKnowledgeBaseTopicId] = useState(
    shq.knowledgeBaseTopicId || ''
  );
  const [ticketLabel, setTicketLabel] = useState(shq.ticketLabel || '');
  const [ticketPipelineId, setTicketPipelineId] = useState(
    shq.ticketPipelineId || ''
  );
  const [ticketBoardId, setTicketBoardId] = useState(shq.ticketBoardId || '');

  const [appearance, setAppearance] = useState(
    shqAppearance
      ? {
          primaryColor: shqAppearance.primaryColor
            ? shqAppearance.primaryColor
            : '',
          secondaryColor: shqAppearance.secondaryColor
            ? shqAppearance.secondaryColor
            : '',
          bodyColor: shqAppearance.bodyColor ? shqAppearance.bodyColor : '',
          headerColor: shqAppearance.headerColor
            ? shqAppearance.headerColor
            : '',
          footerColor: shqAppearance.footerColor
            ? shqAppearance.footerColor
            : ''
        }
      : {
          primaryColor: 'red',
          secondaryColor: 'green',
          bodyColor: '',
          headerColor: '',
          footerColor: ''
        }
  );

  const onSave = () => {
    edit({
      _id: props.shq._id,
      logo: logo
        ? {
            name: logo.name,
            url: logo.url,
            size: logo.size,
            type: logo.type
          }
        : undefined,
      appearance,
      webName,
      webDescription,
      url,
      knowledgeBaseLabel,
      knowledgeBaseTopicId,
      ticketLabel,
      ticketPipelineId,
      ticketBoardId,
      favicon: favicon
        ? {
            name: favicon.name,
            url: favicon.url,
            size: favicon.size,
            type: favicon.type
          }
        : undefined
    });
  };

  const onChangeColor = (key: string, value: any) => {
    setAppearance({ ...appearance, [key]: value });
  };

  const onChangeAttachment = (e: any) => {
    setLogo(e);
  };

  const handleSelectBoard = (option: ISelectedOption) => {
    const value = option ? option.value : '';

    if (value) {
      fetchPipelines(value);
    }

    setTicketBoardId(value);
  };

  const getContentValues = (contentType: string) => {
    if (contentType === 'knowledgebase') {
      return kbTopics.map(c => ({ value: c._id, label: c.title }));
    }

    if (contentType === 'boards') {
      return boards.map(c => ({ value: c._id, label: c.name }));
    }

    if (contentType === 'pipeline') {
      return pipelines.map(c => ({ value: c._id, label: c.name }));
    }
  };

  const renderColorSelect = (item, color) => {
    const popoverBottom = (
      <Popover id="color-picker">
        <TwitterPicker
          width="266px"
          triangle="hide"
          color={color}
          onChange={e => onChangeColor(item, e.hex)}
        />
      </Popover>
    );

    return (
      <OverlayTrigger
        trigger="click"
        rootClose={true}
        placement="bottom-start"
        overlay={popoverBottom}
      >
        <ColorPick>
          <ColorPicker
            style={{
              backgroundColor: color
            }}
          />
        </ColorPick>
      </OverlayTrigger>
    );
  };

  return (
    <AppearanceWrapper>
      <GeneralWrapper>
        <TeamPortal>
          <p>SHQ Web Appearance</p>
          <FeatureRow>
            <FeatureRowItem>
              <ControlLabel>{__('Name your shq')}</ControlLabel>
              <FormControl
                value={webName}
                placeholder="Name"
                onChange={(e: any) => setWebName(e.target.value)}
              />
            </FeatureRowItem>
            <FeatureRowItem>
              <ControlLabel>{__('Describe your team portal')}</ControlLabel>
              <FormControl
                value={webDescription}
                placeholder="Description"
                onChange={(e: any) => setWebDescription(e.target.value)}
              />
            </FeatureRowItem>
          </FeatureRow>
          <FeatureRow>
            <FeatureRowItem>
              <ControlLabel>{__('Website')}</ControlLabel>
              <FormControl
                value={url}
                placeholder="website"
                onChange={(e: any) => setUrl(e.target.value)}
              />
            </FeatureRowItem>
          </FeatureRow>
        </TeamPortal>

        <TeamPortal>
          <p>KnowledgeBase</p>

          <FeatureRow>
            <FeatureRowItem>
              <ControlLabel>{__('Knowledge Base Name')}</ControlLabel>
              <FormControl
                value={knowledgeBaseLabel}
                placeholder="Knowledge Base Name"
                onChange={(e: any) => setKnowledgeBaseLabel(e.target.value)}
              />
            </FeatureRowItem>
            <FeatureRowItem>
              <ControlLabel>{__('Knowledge base topic in EXM ')}</ControlLabel>
              <Select
                placeholder={__('Select a knowledge base topic')}
                value={knowledgeBaseTopicId}
                options={getContentValues('knowledgebase')}
                onChange={(e: any) => {
                  setKnowledgeBaseTopicId(e.value);
                }}
                clearable={false}
              />
            </FeatureRowItem>
          </FeatureRow>
        </TeamPortal>

        <TeamPortal>
          <p>Tickets</p>

          <FeatureRow>
            <FeatureRowItem>
              <ControlLabel>{__('Ticket Name')}</ControlLabel>
              <FormControl
                value={ticketLabel}
                placeholder="Ticket Name"
                onChange={(e: any) => setTicketLabel(e.target.value)}
              />
            </FeatureRowItem>
            <FeatureRowItem>
              <ControlLabel>{__('Ticket Board in EXM')}</ControlLabel>
              <Select
                placeholder={__('Select a ticket board')}
                value={ticketBoardId}
                options={getContentValues('boards')}
                onChange={handleSelectBoard}
                clearable={false}
              />
            </FeatureRowItem>
            <FeatureRowItem>
              <ControlLabel>{__('Ticket pipeline in EXM')}</ControlLabel>
              <Select
                placeholder={__('Select a ticket pipeline')}
                value={ticketPipelineId}
                options={getContentValues('pipeline')}
                onChange={(e: any) => {
                  setTicketPipelineId(e.value);
                }}
                clearable={false}
              />
            </FeatureRowItem>
          </FeatureRow>
        </TeamPortal>

        <Logos>
          <p>Company vision and strucutre</p>
          <FeatureRow>
            <FeatureRowItem>
              <p>Vision</p>
              <ModalTrigger
                title={shq.vision ? 'Edit Vision' : 'Add Vision'}
                size="lg"
                trigger={
                  <Button btnStyle="simple">
                    {__(shq.vision ? 'Edit Vision' : 'Add Vision')}
                  </Button>
                }
                content={modalProps => (
                  <VisionStructureForm
                    {...modalProps}
                    object={shq}
                    type="vision"
                    renderButton={renderButton}
                  />
                )}
              />
            </FeatureRowItem>
            <FeatureRowItem>
              <p>Structure</p>
              <ModalTrigger
                title={shq.structure ? 'Edit Structure' : 'Add Structure'}
                size="lg"
                trigger={
                  <Button btnStyle="simple">
                    {__(shq.structure ? 'Edit Structure' : 'Add Structure')}
                  </Button>
                }
                content={modalProps => (
                  <VisionStructureForm
                    {...modalProps}
                    object={shq}
                    type="structure"
                    renderButton={renderButton}
                  />
                )}
              />
            </FeatureRowItem>
          </FeatureRow>
        </Logos>
        <Logos>
          <p>Logo and favicon</p>
          <FeatureRow>
            <FeatureRowItem>
              <p>Logos</p>
              <ControlLabel>{__('Logo 128x128 or 256x256')}</ControlLabel>
              <Uploader
                defaultFileList={logo ? [logo] : []}
                onChange={(e: any) =>
                  onChangeAttachment(e.length ? e[0] : null)
                }
                single={true}
              />
            </FeatureRowItem>
            <FeatureRowItem>
              <p>Favicon</p>
              <ControlLabel>{__('Logo 128x128 or 256x256')}</ControlLabel>
              <Uploader
                defaultFileList={favicon ? [favicon] : []}
                onChange={(e: any) => setFavicon(e.length ? e[0] : null)}
                single={true}
              />
            </FeatureRowItem>
          </FeatureRow>
        </Logos>

        <Colors>
          <p>Colors</p>
          <div>
            <ControlLabel>{__('Primary color')}</ControlLabel>
            {renderColorSelect('primaryColor', appearance.primaryColor)}
          </div>
          <div>
            <ControlLabel>{__('Secondary color')}</ControlLabel>
            {renderColorSelect('secondaryColor', appearance.secondaryColor)}
          </div>
          <div>
            <ControlLabel>{__('Body color')}</ControlLabel>
            {renderColorSelect('bodyColor', appearance.bodyColor)}
          </div>
          <div>
            <ControlLabel>{__('Header color')}</ControlLabel>
            {renderColorSelect('headerColor', appearance.headerColor)}
          </div>
          <div>
            <ControlLabel>{__('Footer color')}</ControlLabel>
            {renderColorSelect('footerColor', appearance.footerColor)}
          </div>
        </Colors>
        <Button btnStyle="success" onClick={onSave}>
          Save
        </Button>
      </GeneralWrapper>
    </AppearanceWrapper>
  );
}
