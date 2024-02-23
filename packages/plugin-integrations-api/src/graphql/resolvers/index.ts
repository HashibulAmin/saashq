import customScalars from '@saashq/api-utils/src/customScalars';
import IntegrationQueries from './integrationQueries';
import IntegrationMutations from './integrationMutations';

const resolvers: any = {
  ...customScalars,
  Query: {
    ...IntegrationQueries,
  },
  Mutation: {
    ...IntegrationMutations
  }
};

export default resolvers;
