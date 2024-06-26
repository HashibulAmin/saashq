import { BarItems, Wrapper } from '@saashq/ui/src/layout';
import React from 'react';
import { IAsset, IAssetCategory } from '../../common/types';
import { breadcrumb } from '../../common/constant';
import { FlexItem, InputBar, Title } from '@saashq/ui-settings/src/styles';
import {
  __,
  router,
  confirm,
  Table,
  FormControl,
  Pagination,
  DataWithLoader,
  Button,
  ModalTrigger,
  Icon,
  Alert,
} from '@saashq/ui/src';
import Row from './Row';
import { Link } from 'react-router-dom';
import AssetForm from '../containers/AssetForm';
import { isEnabled } from '@saashq/ui/src/utils/core';
import MergeAssets from './actions/Merge';
import AssignArticles from '../containers/actions/Assign';
import Sidebar from '../containers/Sidebar';

type Props = {
  assets: IAsset[];
  assetsCount: number;
  history: any;
  queryParams: any;
  isAllSelected: boolean;
  bulk: any[];
  emptyBulk: () => void;
  remove: (doc: { assetIds: string[] }, emptyBulk: () => void) => void;
  assignKbArticles: (
    doc: { assetIds: string[] },
    emptyBulk: () => void,
  ) => void;
  toggleBulk: () => void;
  toggleAll: (targets: IAsset[], containerId: string) => void;
  loading: boolean;
  searchValue: string;
  currentCategory: IAssetCategory;
  currentParent: IAsset;
  mergeAssets: () => void;
  mergeAssetLoading;
};

function List(props: Props) {
  const {
    assets,
    assetsCount,
    history,
    queryParams,
    isAllSelected,
    bulk,
    emptyBulk,
    remove,
    assignKbArticles,
    toggleBulk,
    toggleAll,
    loading,
    searchValue,
    currentCategory,
    currentParent,
    mergeAssets,
    mergeAssetLoading,
  } = props;

  const [search, setSearch] = React.useState(searchValue);
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    emptyBulk();
  }, [assets.length]);

  const handleSearch = (e) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const value = e.target.value;
    setSearch(value);

    timerRef.current = window.setTimeout(() => {
      router.setParams(history, { searchValue: value });
      router.removeParams(history, 'page');
    }, 500);
  };

  const handleSelectAllChange = () => {
    toggleAll(assets, 'assets');
  };

  const moveCursorAtTheEnd = (e) => {
    const tmpValue = e.target.value;

    e.target.value = '';
    e.target.value = tmpValue;
  };

  const renderRow = () => {
    return assets.map((asset) => (
      <Row
        history={history}
        key={asset._id}
        asset={asset}
        toggleBulk={toggleBulk}
        queryParams={queryParams}
        isChecked={bulk.includes(asset)}
        assignKbArticles={assignKbArticles}
      />
    ));
  };

  const renderFormContent = (formProps) => {
    return <AssetForm {...formProps} queryParams={queryParams} />;
  };

  const assetsMerge = (assetsProps) => {
    return (
      <MergeAssets
        {...assetsProps}
        objects={bulk}
        save={mergeAssets}
        mergeAssetLoading={mergeAssetLoading}
      />
    );
  };

  const assignArticles = (articlesProps) => {
    return (
      <AssignArticles
        {...articlesProps}
        objects={bulk}
        save={assignKbArticles}
      />
    );
  };

  const removeAssets = (selectedAssets) => {
    const assetIds: string[] = [];

    selectedAssets.forEach((selectedAsset) => {
      assetIds.push(selectedAsset._id);
    });

    remove({ assetIds }, emptyBulk);
  };

  const rightActionBar = () => {
    if (bulk.length > 0) {
      const onClick = () => {
        confirm()
          .then(() => {
            removeAssets(bulk);
          })
          .catch((error) => {
            Alert.error(error.message);
          });
      };

      const mergeButton = (
        <Button btnStyle="success" icon="merge">
          Spojit
        </Button>
      );

      const assignButton = (
        <Button btnStyle="success" icon="merge">
          Přiřaďte články znalostní báze
        </Button>
      );

      return (
        <BarItems>
          {bulk.length === 2 && (
            <ModalTrigger
              title="Sloučit Aktiva"
              dialogClassName="modal-1000w"
              trigger={mergeButton}
              content={assetsMerge}
            />
          )}

          {isEnabled('knowledgebase') && (
            <ModalTrigger
              title="Přiřaďte články znalostní báze"
              size="lg"
              dialogClassName="modal-1000w"
              trigger={assignButton}
              content={assignArticles}
            />
          )}

          <Button btnStyle="danger" icon="cancel-1" onClick={onClick}>
            Odstranit
          </Button>
        </BarItems>
      );
    }

    return (
      <BarItems>
        <InputBar type="searchBar">
          <Icon icon="search-1" size={20} />
          <FlexItem>
            <FormControl
              type="text"
              placeholder={__('Zadejte a vyhledejte')}
              onChange={handleSearch}
              value={search}
              autoFocus={true}
              onFocus={moveCursorAtTheEnd}
            />
          </FlexItem>
        </InputBar>

        <Link to="/settings/importHistories?type=asset">
          <Button btnStyle="simple" icon="arrow-from-right">
            {__('Importujte položky')}
          </Button>
        </Link>

        <ModalTrigger
          title="Přidat Aktiva"
          trigger={
            <Button btnStyle="success" icon="plus-circle">
              Přidat Aktiva
            </Button>
          }
          content={renderFormContent}
          autoOpenKey="showListFormModal"
          dialogClassName="transform"
          size="lg"
        />
      </BarItems>
    );
  };

  const content = (
    <Table>
      <thead>
        <tr>
          <th style={{ width: 60 }}>
            <FormControl
              checked={isAllSelected}
              componentClass="checkbox"
              onChange={handleSelectAllChange}
            />
          </th>
          <th>{__('Kód')}</th>
          <th>{__('Název')}</th>
          <th>{__('Kategorie')}</th>
          <th>{__('Rodič')}</th>
          <th>{__('Jednotková Cena')}</th>
          <th>{__('Akce')}</th>
        </tr>
      </thead>
      <tbody>{renderRow()}</tbody>
    </Table>
  );

  const sidebar = <Sidebar queryParams={queryParams} history={history} />;

  const leftActionBar = (
    <Title>{`${
      currentCategory.name || currentParent.name || 'Všechna Aktiva'
    } (${assetsCount})`}</Title>
  );

  return (
    <Wrapper
      header={
        <Wrapper.Header
          title={__('Seznam Aktiv')}
          breadcrumb={breadcrumb}
          queryParams={queryParams}
        />
      }
      actionBar={
        <Wrapper.ActionBar left={leftActionBar} right={rightActionBar()} />
      }
      content={
        <DataWithLoader
          data={content}
          loading={loading}
          count={assetsCount}
          emptyText="Nejsou žádná data"
          emptyImage="/images/actions/5.svg"
        />
      }
      leftSidebar={sidebar}
      transparent={true}
      hasBorder={true}
      footer={<Pagination count={assetsCount} />}
    />
  );
}

export default List;
