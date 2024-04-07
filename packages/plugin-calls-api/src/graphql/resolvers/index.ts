import customScalars from '@saashq/api-utils/src/customScalars';
import customResolvers from './customResolvers';

import mutations from './mutations';
import queries from './queries';

const resolvers: any = async () => ({
  ...customScalars,
  ...customResolvers,
  Mutation: {
    ...mutations,
  },
  Query: {
    ...queries,
  },
});

export default resolvers;
