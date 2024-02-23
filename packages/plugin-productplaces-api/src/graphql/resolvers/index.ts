import customScalars from '@saashq/api-utils/src/customScalars';

const resolvers: any = async () => ({
  ...customScalars,

  Query: {},

  Mutation: {}
});

export default resolvers;
