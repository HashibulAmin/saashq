import customScalars from '@saashq/api-utils/src/customScalars';

import Mutation from './mutaions';
import Query from './queries';
import Investment from './investment';

const resolvers: any = async () => ({
  ...customScalars,
  Investment,
  Mutation,
  Query
});

export default resolvers;
