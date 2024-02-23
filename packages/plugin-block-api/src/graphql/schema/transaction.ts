export const types = `
  type Transaction {
    _id: String!
    saashqCustomerId: String
    type: String
    status: String
    createdAt: Date
    modifiedAt: Date
  }
`;

export const queries = `
  transaction(saashqCustomerId: String, type: String): [Transaction]
`;

const transactionParams = `
  saashqCustomerId: String
  type: String
  status: String
`;

export const mutations = `
  transactionsAdd(${transactionParams}): Transaction
`;
