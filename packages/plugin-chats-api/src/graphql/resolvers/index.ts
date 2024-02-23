import customScalars from '@saashq/api-utils/src/customScalars';
import Mutation from './mutations';
import Query from './queries';
import Chat from './chat';
import ChatMessage from './chatMessage';

const resolvers: any = async () => ({
  ...customScalars,

  Chat,
  ChatMessage,

  Mutation,
  Query
});

export default resolvers;
