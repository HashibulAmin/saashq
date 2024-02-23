import { currentUser as currentUserQuery } from '@saashq/ui/src/auth/graphql';

const currentUser = currentUserQuery;
export default { currentUser };
