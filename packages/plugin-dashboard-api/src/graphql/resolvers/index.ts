import dashboardMutations from './dashboardMutations';
import dashboardQueries from './dashboardQueries';
import customScalars from '@saashq/api-utils/src/customScalars';
import Dashboardz from './dashboardz';

const resolvers: any = {
  ...customScalars,
  Dashboardz,

  Mutation: {
    ...dashboardMutations,
  },
  Query: {
    ...dashboardQueries,
  },
};

export default resolvers;
