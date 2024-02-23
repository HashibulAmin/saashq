import customScalars from '@saashq/api-utils/src/customScalars';

import mutations from './mutations';
import queries from './queries';

const resolvers: any = async () => ({
  ...customScalars,
  Mutation: {
    ...mutations,
  },
  Query: {
    ...queries,
  },
});

export default resolvers;
