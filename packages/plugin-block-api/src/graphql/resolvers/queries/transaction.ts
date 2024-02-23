import { IContext } from '../../../connectionResolver';
import { getBalance } from '../../../utils';

const transactionQueries = {
  async transaction(
    _root,
    { saashqCustomerId, type },
    { subdomain, models }: IContext
  ) {
    const filter: any = {};

    if (saashqCustomerId) {
      filter.saashqCustomerId = saashqCustomerId;
    }

    if (type) {
      filter.type = type;
    }

    return models.Transactions.find(filter).sort({ createdAt: -1 });
  }
};

// requireLogin(transactionQueries, 'transaction');

export default transactionQueries;
