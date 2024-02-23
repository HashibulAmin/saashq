import {
  AddMutationResponse as AddMutationResponseC,
  CustomersQueryResponse as CustomersQueryResponseC,
  ICustomer as ICustomerC,
  ICustomerDoc as ICustomerDocC,
  ICustomerLinks as ICustomerLinksC,
  IUrlVisits as IUrlVisitsC,
  IVisitorContact as IVisitorContactC
} from '@saashq/ui-contacts/src/customers/types';

import { IIntegration } from '@saashq/ui-inbox/src/settings/integrations/types';

export type IVisitorContact = IVisitorContactC;

export type ICustomerLinks = ICustomerLinksC;

export type ICustomerDoc = ICustomerDocC;

export type IUrlVisits = IUrlVisitsC;

export interface ICustomer extends ICustomerC {
  integration?: IIntegration;
}

// mutation types
export type AddMutationResponse = AddMutationResponseC;

// query types
export type CustomersQueryResponse = CustomersQueryResponseC;
