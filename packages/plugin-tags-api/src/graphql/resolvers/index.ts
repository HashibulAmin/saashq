import customScalars from '@saashq/api-utils/src/customScalars';
import Tag from './tags';

import {
  Tags as TagMutations,
} from './mutations';

import {
  Tags as TagQueries,
} from './queries';

const resolvers: any = async () => (  
  {
  ...customScalars,
  Tag,
  Mutation: {
    ...TagMutations,
  },
  Query: {
    ...TagQueries,
  }
});

export default resolvers;
