import {
  IBookingData,
  IIntegration
} from '@saashq/ui-inbox/src/settings/integrations/types';
import { MutationVariables, QueryResponse } from '@saashq/ui/src/types';

import { IBrand } from '@saashq/ui/src/brands/types';
import { ILeadData } from '@saashq/ui-leads/src/types';
import { ITag } from '@saashq/ui-tags/src/types';
import { IUser } from '@saashq/ui/src/auth/types';

export interface IBookingIntegration extends IIntegration {
  brand: IBrand;
  tags: ITag[];
  createdUser: IUser;
}

export type IBooking = {
  name: string;
  description: string;
  userFilters: string[];
  image: any;
  productCategoryId: string;
  itemShape: string;
  widgetColor: string;
  productAvailable: string;
  line?: string;
  columns?: number;
  rows?: number;
  margin?: number;
  navigationText?: string;
  bookingFormText?: string;
  baseFont: string;
  productFieldIds?: string[];
};

// query types
export type BookingIntegrationsQueryResponse = {
  integrations: IBookingIntegration[];
} & QueryResponse;

export type BookingIntegrationDetailQueryResponse = {
  integrationDetail: IBookingIntegration;
} & QueryResponse;

// mutation types
export type RemoveMutationResponse = {
  removeMutation: (params: { variables: MutationVariables }) => Promise<any>;
};

export type IntegrationMutationVariables = {
  brandId: string;
  name: string;
  channelIds?: string[];
  data?: any;
};

export type AddBookingIntegrationMutationVariables = {
  leadData: ILeadData;
  bookingData: IBookingData;
  languageCode: string;
  formId: string;
} & IntegrationMutationVariables;

export type AddBookingIntegrationMutationResponse = {
  addIntegrationMutation: (params: {
    variables: AddBookingIntegrationMutationVariables;
  }) => Promise<any>;
};

export type EditBookingIntegrationMutationVariables = {
  _id: string;
  leadData: ILeadData;
  bookingData: IBookingData;
  languageCode: string;
  formId: string;
} & IntegrationMutationVariables;

export type EditBookingIntegrationMutationResponse = {
  editIntegrationMutation: (params: {
    variables: EditBookingIntegrationMutationVariables;
  }) => Promise<void>;
};
