import Button from '@saashq/ui/src/components/Button';
import CategoryFormContainer from '../../containers/categories/CategoryForm';
import DataWithLoader from '@saashq/ui/src/components/DataWithLoader';
import { ICategory } from '../../types';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import React from 'react';
import RowContainer from '../../containers/categories/Row';
import Table from '@saashq/ui/src/components/table';
import { Title } from '@saashq/ui-settings/src/styles';
import Wrapper from '@saashq/ui/src/layout/components/Wrapper';
import { __ } from 'coreui/utils';

type Props = {
  forumCategories: ICategory[];
};

export default function CategoriesList({ forumCategories }: Props) {
  const breadcrumb = [
    { title: __('Nastavení'), link: '/settings' },
    { title: __('Categories'), link: '/forums/categories' },
  ];

  const trigger = (
    <Button id={'AddCategoryButton'} btnStyle="success" icon="plus-circle">
      Add Category
    </Button>
  );

  const modalContent = (props) => <CategoryFormContainer {...props} />;

  const actionBarRight = (
    <ModalTrigger
      title={__('Add category')}
      autoOpenKey={`showForumCategoriesModal`}
      trigger={trigger}
      size="lg"
      content={modalContent}
      enforceFocus={false}
    />
  );

  const actionBar = (
    <Wrapper.ActionBar
      left={<Title capitalize={true}>{__('Categories')}</Title>}
      right={actionBarRight}
    />
  );

  const content = (
    <Table>
      <thead>
        <tr>
          <th>{__('Název')}</th>
          <th>{__('Popis')}</th>
          <th>{__('Code')}</th>
          <th>{__('Post Counts')}</th>
          <th>{__('Order')}</th>
          <th>{__('Akce')}</th>
        </tr>
      </thead>
      <tbody id={'ForumCategoriesList'}>
        {forumCategories.map((cat: ICategory) => {
          return <RowContainer key={cat._id} category={cat} />;
        })}
      </tbody>
    </Table>
  );

  return (
    <Wrapper
      header={
        <Wrapper.Header title={__('Categories')} breadcrumb={breadcrumb} />
      }
      actionBar={actionBar}
      content={
        <DataWithLoader
          data={content}
          loading={false}
          count={forumCategories.length}
          emptyText={__('There is no categories') + '.'}
          emptyImage="/images/actions/8.svg"
        />
      }
      transparent={true}
      hasBorder={true}
    />
  );
}
