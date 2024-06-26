import React, { useState } from 'react';
import Attachment from '@saashq/ui/src/components/Attachment';
import Button from '@saashq/ui/src/components/Button';
import DropdownToggle from '@saashq/ui/src/components/DropdownToggle';
import Icon from '@saashq/ui/src/components/Icon';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import { Actions, InfoWrapper } from '@saashq/ui/src/styles/main';
import { IAttachment } from '@saashq/ui/src/types';
import { Alert, confirm, __ } from '@saashq/ui/src/utils';

import { Name } from '@saashq/ui-contacts/src/customers/styles';
import Sidebar from '@saashq/ui/src/layout/components/Sidebar';
import {
  FieldStyle,
  SidebarCounter,
  SidebarFlexRow,
  SidebarList,
} from '@saashq/ui/src/layout/styles';
import moment from 'moment';
import Dropdown from 'react-bootstrap/Dropdown';
import xss from 'xss';
import { IAsset } from '../../../common/types';
import { AssetContent, ContainerBox } from '../../../style';
import { Tip } from '@saashq/ui/src';
import { isEnabled } from '@saashq/ui/src/utils/core';
import AssetForm from '../../containers/AssetForm';
import AssignArticles from '../../containers/actions/Assign';
import KnowledgeBase from '../../containers/detail/KnowledgeBase';

type Props = {
  asset: IAsset;
  remove: () => void;
  assignKbArticles: (doc: {
    ids: string[];
    data: any;
    callback: () => void;
  }) => void;
  history: any;
};

function BasicInfo({ asset, remove, assignKbArticles, history }: Props) {
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);

  const renderVendor = (vendor) => {
    if (!vendor) {
      return (
        <li>
          <FieldStyle>{__(`Prodejce`)}</FieldStyle>
          <SidebarCounter>-</SidebarCounter>
        </li>
      );
    }

    return (
      <li>
        <FieldStyle>{__(`Prodejce`)}</FieldStyle>
        <SidebarCounter>{vendor.primaryName || ''}</SidebarCounter>
        <Button
          onClick={() => history.push(`/companies/detail/${vendor._id}`)}
          btnStyle="link"
          style={{ padding: '0', paddingLeft: '8px' }}
        >
          <Tip text="Viz Detail dodavatele" placement="bottom">
            <Icon icon="rightarrow" />
          </Tip>
        </Button>
      </li>
    );
  };

  const renderView = (name, variable, extraField?: any) => {
    const defaultName = name.includes('count') ? 0 : '-';

    return (
      <li>
        <FieldStyle>{__(name)}</FieldStyle>
        <SidebarCounter>{variable || defaultName}</SidebarCounter>
        {extraField && extraField}
      </li>
    );
  };
  const renderKbDetail = () => {
    const content = (props) => (
      <AssignArticles
        {...props}
        knowledgeData={asset?.knowledgeData}
        assignedArticleIds={asset.kbArticleIds}
        objects={[asset]}
        save={assignKbArticles}
      />
    );

    return (
      <ModalTrigger
        title="Upravit přiřazené články znalostní báze"
        dialogClassName="modal-1000w"
        content={content}
        size="xl"
        trigger={
          <li>
            <a href="#assign">{__('Přiřadit')}</a>
          </li>
        }
      />
    );
  };

  const renderAction = () => {
    const onDelete = () =>
      confirm()
        .then(() => remove())
        .catch((error) => {
          Alert.error(error.message);
        });

    return (
      <Actions>
        <Dropdown>
          <Dropdown.Toggle as={DropdownToggle} id="dropdown-info">
            <Button btnStyle="simple" size="medium">
              {__('Akce')}
              <Icon icon="angle-down" />
            </Button>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <li>
              <a href="#delete" onClick={onDelete}>
                {__('Vymazat')}
              </a>
            </li>
            {renderEditForm()}
            {isEnabled('knowledgebase') && renderKbDetail()}
          </Dropdown.Menu>
        </Dropdown>
      </Actions>
    );
  };

  const renderImage = (item: IAttachment) => {
    if (!item) {
      return null;
    }

    return <Attachment attachment={item} />;
  };

  const renderEditForm = () => {
    const content = (props) => <AssetForm {...props} asset={asset || {}} />;

    return (
      <ModalTrigger
        title="Upravit základní informace
        "
        trigger={
          <li>
            <a href="#edit">{__('Upravit')}</a>
          </li>
        }
        size="lg"
        content={content}
      />
    );
  };

  const changeAssetDetail = () => {
    return (
      <Button
        onClick={() =>
          history.push(`/settings/asset/detail/${asset.parent._id}`)
        }
        btnStyle="link"
        style={{ padding: '0', paddingLeft: '8px' }}
      >
        <Tip text="Viz Podrobnosti nadřazeného majetku" placement="bottom">
          <Icon icon="rightarrow" />
        </Tip>
      </Button>
    );
  };

  const renderAssetContent = () => {
    if (!asset.description) {
      return null;
    }

    return (
      <AssetContent
        dangerouslySetInnerHTML={{
          __html: xss(asset.description),
        }}
      />
    );
  };

  return (
    <Sidebar.Section>
      <InfoWrapper>
        <Name>{asset.name}</Name>
        {renderAction()}
      </InfoWrapper>

      {renderImage(asset.attachment)}
      <SidebarList className="no-link">
        {renderView('Kód', asset.code)}
        {renderView('Typ', asset.type)}
        {renderView('Kategorie', asset.category ? asset.category.name : '')}
        {renderView(
          'Rodič',
          asset.parent ? asset.parent.name : '',
          asset.parent && changeAssetDetail(),
        )}
        {renderView('Jednotková cena', (asset.unitPrice || 0).toLocaleString())}
        {renderVendor(asset.vendor)}
        {renderView(
          'Vytvořit v',
          moment(asset.createdAt).format('YYYY-MM-DD HH:mm'),
        )}
        {renderView(
          'Znalostní Báze',
          <Icon
            icon={showKnowledgeBase ? 'uparrow' : 'downarrow-2'}
            onClick={() => setShowKnowledgeBase(!showKnowledgeBase)}
          />,
        )}
        {showKnowledgeBase && (
          <KnowledgeBase asset={asset} kbArticleIds={asset.kbArticleIds} />
        )}
        <SidebarFlexRow>{__(`Popis`)}</SidebarFlexRow>
      </SidebarList>
      {renderAssetContent()}
    </Sidebar.Section>
  );
}

export default BasicInfo;
