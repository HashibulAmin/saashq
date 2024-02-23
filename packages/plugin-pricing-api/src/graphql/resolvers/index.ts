import Mutation from './mutations';
import Query from './queries';
import customScalars from '@saashq/api-utils/src/customScalars';
import { PricingPlan } from './customResolvers/pricingPlan';

const resolvers: any = {
  ...customScalars,
  PricingPlan,
  Mutation,
  Query
};

export default resolvers;
