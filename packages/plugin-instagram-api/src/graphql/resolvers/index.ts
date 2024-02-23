import customScalars from '@saashq/api-utils/src/customScalars';

import mutations from './mutations';
import queries from './queries';
import InstagramConversationMessage from './conversationMessage';

const resolvers: any = async () => ({
  ...customScalars,
  InstagramConversationMessage,
  Mutation: {
    ...mutations
  },
  Query: {
    ...queries
  }
});

export default resolvers;
