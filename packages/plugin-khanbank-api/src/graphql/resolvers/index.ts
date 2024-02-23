import customScalars from '@saashq/api-utils/src/customScalars';

import mutations from './mutations';
import queries from './queries';
import { KhanbankAccount } from './accounts';
import { KhanbankStatement } from './statements';

const resolvers: any = async () => ({
  ...customScalars,

  KhanbankAccount,
  // KhanbankStatement,

  Mutation: {
    ...mutations
  },
  Query: {
    ...queries
  }
});

export default resolvers;
