export const types = `
  type Investment {
    _id: String!
    saashqCustomerId: String
    packageId: String    
    createdAt: Date
    modifiedAt: Date
    amount: Float

    package: Package
  }

  type Block {
    _id: String!
    balance: Float
    isVerified: String
  }
`;

export const queries = `
  totalInvestment: Float
  getBalance(saashqCustomerId: String): Float
  isVerified(saashqCustomerId: String): String
  investments(saashqCustomerId: String): [Investment]
  totalInvestmentCount: Float
`;

export const mutations = `
  invest(saashqCustomerId: String, packageId: String, amount: Float): Investment
  addBalance(saashqCustomerId: String, amount: Float): Block
  updateVerify(saashqCustomerId: String, isVerified: String): Block
`;
