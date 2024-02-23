import gql from 'graphql-tag';

import { types, mutations, queries } from './schema/shq';

const typeDefs = async () => {
  return gql`
    scalar JSON
    scalar Date

    ${await types()}

    extend type Query {
      ${queries}
    }

    extend type Mutation {
      ${mutations}
    }
  `;
};

export default typeDefs;
