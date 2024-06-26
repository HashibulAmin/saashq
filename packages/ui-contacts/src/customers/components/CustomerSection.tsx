import { __, renderFullName } from '@saashq/ui/src/utils';

import Box from '@saashq/ui/src/components/Box';
import { ButtonRelated } from '@saashq/ui/src/styles/main';
import CustomerChooser from '../containers/CustomerChooser';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import { ICustomer } from '../types';
import Icon from '@saashq/ui/src/components/Icon';
import { Link } from 'react-router-dom';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import React from 'react';
import { SectionBodyItem } from '@saashq/ui/src/layout/styles';
import Spinner from '@saashq/ui/src/components/Spinner';
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

export type Props = {
  name: string;
  items: ICustomer[];
  mainType?: string;
  mainTypeId?: string;
  onSelect?: (customers: ICustomer[]) => void;
  actionSection?: any;
  title?: string;
  relType?: string;
};

function Component({
  relType,
  name,
  items = [],
  mainType = '',
  mainTypeId = '',
  onSelect,
  actionSection,
  title = '',
}: Props) {
  const renderRelatedCustomerChooser = (props) => {
    return (
      <CustomerChooser
        {...props}
        data={{ name, customers: items, mainTypeId, mainType, isRelated: true }}
        onSelect={onSelect}
      />
    );
  };

  const relCustomerTrigger = (
    <ButtonRelated>
      <span>{__('Viz související zákazníci..')}</span>
    </ButtonRelated>
  );

  const relQuickButtons = (
    <ModalTrigger
      title="Související spolupracovník"
      trigger={relCustomerTrigger}
      size="lg"
      content={renderRelatedCustomerChooser}
    />
  );

  const renderActionSection = (customer) => {
    if (!actionSection) {
      return;
    }

    const ActionSection = actionSection;
    return <ActionSection customer={customer} isSmall={true} />;
  };

  const renderBody = (customersObj: ICustomer[]) => {
    if (!customersObj) {
      return <Spinner objective={true} />;
    }
    return (
      <div>
        {customersObj.map((customer, index) => (
          <SectionBodyItem key={index}>
            <Link to={`/contacts/details/${customer._id}`}>
              {renderFullName(customer)}
            </Link>
            {renderActionSection(customer)}
          </SectionBodyItem>
        ))}
        {customersObj.length === 0 && (
          <EmptyState icon="user-6" text="Žádný zákazník" />
        )}
        {mainTypeId && mainType && relQuickButtons}
      </div>
    );
  };

  const customerChooser = (props) => {
    return (
      <CustomerChooser
        {...props}
        data={{ name, customers: items, mainTypeId, mainType, relType }}
        onSelect={onSelect}
      />
    );
  };

  const extraButtons = (
    <ModalTrigger
      title="Spolupracovník"
      size="lg"
      trigger={
        <button>
          <Icon icon="plus-circle" />
        </button>
      }
      content={customerChooser}
    />
  );

  return (
    <Box
      title={__(`${title || 'Zákazníci'}`)}
      extraButtons={extraButtons}
      isOpen={true}
      name="showCustomers"
    >
      {renderBody(items)}
    </Box>
  );
}

export type ICustomerSectionProps = {
  mainType?: string;
  mainTypeId?: string;
  isOpen?: boolean;
  customers?: ICustomer[];
  onSelect?: (datas: ICustomer[]) => void;
  actionSection?: any;
  relType?: string;
  title?: string;
};

export default (props: ICustomerSectionProps) => {
  if (!isEnabled('cards')) {
    return null;
  }

  return (
    <GetConformity
      {...props}
      relType={props.relType || 'customer'}
      component={Component}
      queryName="customers"
      itemsQuery={queries.customers}
      alreadyItems={props.customers}
    />
  );
};
