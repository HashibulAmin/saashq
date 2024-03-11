import dashboardMutations from './dashboardMutations';
import dashboardQueries from './dashboardQueries';
import customScalars from '@saashq/api-utils/src/customScalars';
import Dashboard2 from './dashboard2';

const resolvers: any = {
  ...customScalars,
  Dashboard2,

  Mutation: {
    ...dashboardMutations,
  },
  Query: {
    ...dashboardQueries,
  },
};

export default resolvers;
