import customScalars from '@saashq/api-utils/src/customScalars';

import ShqFeed from './shqFeed';
import ShqThank from './shqThank';

import Mutation from './mutations';
import Query from './queries';

const resolvers: any = async () => ({
  ...customScalars,

  ShqFeed,
  ShqThank,

  Mutation,
  Query
});

export default resolvers;
