import dashboardMutations from './dashboardMutations';
import dashboardQueries from './dashboardQueries';
import customScalars from '@saashq/api-utils/src/customScalars';
import Dashboard from './dashboard';

const resolvers: any = {
  ...customScalars,
  Dashboard,

  Mutation: {
    ...dashboardMutations,
  },
  Query: {
    ...dashboardQueries,
  },
};

export default resolvers;
