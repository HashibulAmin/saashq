import React from 'react';
import BreadCrumb from '@saashq/ui/src/components/breadcrumb/BreadCrumb';
import Filter from '@saashq/ui/src/components/filter/Filter';
import Submenu from '@saashq/ui/src/components/subMenu/Submenu';
import { IBreadCrumbItem } from '@saashq/ui/src/types';
import { __, setTitle } from '@saashq/ui/src/utils/core';
import { PageHeader } from '../styles';

type Props = {
  breadcrumb?: IBreadCrumbItem[];
  submenu?: IBreadCrumbItem[];
  queryParams?: any;
  title: string;
  additionalMenuItem?: React.ReactNode;
  filterTitle?: string;
};

class Header extends React.Component<Props> {
  setTitle() {
    const { title } = this.props;

    setTitle(
      title,
      title === `${__('Týmová Schránka')}` && document.title.startsWith('(1)'),
    );
  }

  componentDidUpdate() {
    this.setTitle();
  }

  componentDidMount() {
    this.setTitle();
  }

  render() {
    const {
      breadcrumb,
      submenu,
      queryParams,
      additionalMenuItem,
      filterTitle,
    } = this.props;

    return (
      <PageHeader>
        {breadcrumb && <BreadCrumb breadcrumbs={breadcrumb} />}
        {submenu && (
          <Submenu items={submenu} additionalMenuItem={additionalMenuItem} />
        )}
        {queryParams && (
          <Filter queryParams={queryParams} filterTitle={filterTitle} />
        )}
      </PageHeader>
    );
  }
}

export default Header;
