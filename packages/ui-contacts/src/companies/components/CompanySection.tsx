import { __, urlParser } from '@saashq/ui/src/utils';

import Box from '@saashq/ui/src/components/Box';
import { ButtonRelated } from '@saashq/ui/src/styles/main';
import CompanyChooser from '../containers/CompanyChooser';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import { ICompany } from '../types';
import Icon from '@saashq/ui/src/components/Icon';
import { Link } from 'react-router-dom';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import React from 'react';
import { SectionBodyItem } from '@saashq/ui/src/layout/styles';
import asyncComponent from '@saashq/ui/src/components/AsyncComponent';
import { isEnabled } from '@saashq/ui/src/utils/core';
import { queries } from '../graphql';

const GetConformity = asyncComponent(
  () =>
    isEnabled('cards') &&
    import(
      /* webpackChunkName: "GetConformity" */ '@saashq/ui-cards/src/conformity/containers/GetConformity'
    ),
);

type Props = {
  name: string;
  items?: ICompany[];
  mainType?: string;
  mainTypeId?: string;
  onSelect?: (companies: ICompany[]) => void;
  collapseCallback?: () => void;
  title?: string;
};

function Component(
  this: any,
  {
    name,
    items = [],
    mainType = '',
    mainTypeId = '',
    onSelect,
    collapseCallback,
    title,
  }: Props,
) {
  const renderCompanyChooser = (props) => {
    return (
      <CompanyChooser
        {...props}
        data={{ name, companies: items, mainType, mainTypeId }}
        onSelect={onSelect}
      />
    );
  };

  const renderRelatedCompanyChooser = (props) => {
    return (
      <CompanyChooser
        {...props}
        data={{ name, companies: items, mainTypeId, mainType, isRelated: true }}
        onSelect={onSelect}
      />
    );
  };

  const companyTrigger = (
    <button>
      <Icon icon="plus-circle" />
    </button>
  );

  const relCompanyTrigger = (
    <ButtonRelated>
      <span>{__('Viz související společnosti')}</span>
    </ButtonRelated>
  );

  const quickButtons = (
    <ModalTrigger
      title="Spolupracovník"
      trigger={companyTrigger}
      size="lg"
      content={renderCompanyChooser}
    />
  );

  const relQuickButtons = (
    <ModalTrigger
      title="Související spolupracovník"
      trigger={relCompanyTrigger}
      size="lg"
      content={renderRelatedCompanyChooser}
    />
  );

  const renderExternaleWebsite = (links) => {
    if (!links || !links.website) {
      return null;
    }

    return (
      <span>
        <a href={links.website} target="_blank" rel="noopener noreferrer">
          {urlParser.extractRootDomain(links.website)}
        </a>
      </span>
    );
  };

  const content = (
    <div>
      {items.map((company, index) => (
        <SectionBodyItem key={index}>
          <Link to={`/companies/details/${company._id}`}>
            {company.primaryName || 'Unknown'}
          </Link>
          {renderExternaleWebsite(company.links)}
        </SectionBodyItem>
      ))}
      {items.length === 0 && (
        <EmptyState icon="building" text="Žádná společnost" />
      )}
      {mainTypeId && mainType && relQuickButtons}
    </div>
  );

  return (
    <Box
      title={__(`${title || 'Společnosti'}`)}
      name="showCompanies"
      extraButtons={quickButtons}
      isOpen={true}
      callback={collapseCallback}
    >
      {content}
    </Box>
  );
}

type IProps = {
  mainType?: string;
  mainTypeId?: string;
  isOpen?: boolean;
  companies?: ICompany[];
  onSelect?: (datas: ICompany[]) => void;
  collapseCallback?: () => void;
};

export default (props: IProps) => {
  if (!isEnabled('cards')) {
    return null;
  }

  return (
    <GetConformity
      {...props}
      relType="company"
      component={Component}
      queryName="companies"
      itemsQuery={queries.companies}
      alreadyItems={props.companies}
    />
  );
};
