import { gql } from 'apollo-server-express';
import { isEnabled } from '@saashq/api-utils/src/serviceDiscovery';

import {
  mutations as DashboardMutations,
  queries as DashboardQueries,
  types as DashboardTypes,
} from './dashboardTypeDefs';

const typeDefs = async () => {
  const tagsAvailable = await isEnabled('tags');

  return gql`
  scalar JSON
  scalar Date
  
  ${DashboardTypes(tagsAvailable)}
  
  extend type Query {
    ${DashboardQueries}
  }
  
  extend type Mutation {
    ${DashboardMutations}
  }
  `;
};

export default typeDefs;
