import gql from 'graphql-tag';

import {
  types as shqTypes,
  queries as shqQueries,
  mutations as shqMutations
} from './schema/shqFeed';

const typeDefs = async () => {
  return gql`
    scalar JSON
    scalar Date
    
    ${await shqTypes()}
    
    extend type Query {
      ${shqQueries}
    }
    
    extend type Mutation {
      ${shqMutations}
    }
  `;
};

export default typeDefs;
