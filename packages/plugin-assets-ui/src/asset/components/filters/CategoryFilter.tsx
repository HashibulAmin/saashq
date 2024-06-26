import {
  Box,
  Button,
  DataWithLoader,
  Icon,
  ModalTrigger,
  SidebarList,
  Tip,
  __,
} from '@saashq/ui/src';
import React from 'react';
import { IAssetCategoryTypes } from '../../../common/types';

import { router } from '@saashq/ui/src/utils/core';
import CollapsibleList from '@saashq/ui/src/components/collapsibleList/CollapsibleList';
import CategoryForm from '../../containers/CategoryForm';

type Props = {
  assetCategories: IAssetCategoryTypes[];
  totalCount: number;
  loading: boolean;
  remove: (_id) => any;
  refetchAssetCategories: () => void;
  queryParams: any;
  history: any;
};

function CategoryFilter({
  assetCategories,
  totalCount,
  loading,
  remove,
  refetchAssetCategories,
  queryParams,
  history,
}: Props) {
  const renderEditAction = (category) => {
    const trigger = (
      <Button btnStyle="link">
        <Tip text="Upravit">
          <Icon icon="edit" />
        </Tip>
      </Button>
    );

    const content = (props) => {
      const updatedProps = {
        ...props,
        refetchAssetCategories,
        category,
        categories: assetCategories,
      };

      return <CategoryForm {...updatedProps} />;
    };

    return (
      <ModalTrigger
        isAnimate={true}
        title="Upravit kategorii aktiv"
        content={content}
        trigger={trigger}
      />
    );
  };

  const renderRemoveAction = (object) => {
    return (
      <Button btnStyle="link" onClick={() => remove(object._id)}>
        <Tip text="odstranit" placement="bottom">
          <Icon icon="cancel-1" />
        </Tip>
      </Button>
    );
  };

  const handleClick = (categoryId) => {
    router.setParams(history, { assetCategoryId: categoryId });
    router.removeParams(history, 'page');
  };

  const renderContent = () => {
    return (
      <SidebarList>
        <CollapsibleList
          items={assetCategories}
          editAction={renderEditAction}
          removeAction={renderRemoveAction}
          loading={loading}
          queryParams={queryParams}
          queryParamName="assetCategoryId"
          treeView={true}
          keyCount="assetCount"
          onClick={handleClick}
        />
      </SidebarList>
    );
  };

  const parentCount = assetCategories.filter(
    (category) => !category.parentId || category.parentId === '',
  ).length;

  return (
    <Box
      title="Filtrovat podle kategorie"
      name="assetCategory"
      isOpen={true}
      collapsible={parentCount > 6}
    >
      {renderContent()}
    </Box>
  );
}

export default CategoryFilter;
