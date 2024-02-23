import {
  conformityQueryFieldDefs,
  conformityQueryFields
} from '@saashq/ui-cards/src/conformity';

export const packageFields = `
  _id
  name
  description
  wpId
  level
  projectWpId
  projectId
  price
  duration
  createdAt
  modifiedAt
`;

const listParamsDef = `
  $page: Int
  $perPage: Int
  $searchValue: String
  $level: String
  ${conformityQueryFields}
`;

const listParamsValue = `
  page: $page
  perPage: $perPage
  searchValue: $searchValue
  level: $level
  ${conformityQueryFieldDefs}
`;

export const packages = `
  query packages(${listParamsDef}) {
    packages(${listParamsValue}) {
      ${packageFields}
    }
  }
`;

export const packageCounts = `
  query packageCounts(${listParamsDef}, $only: String) {
    packageCounts(${listParamsValue}, only: $only)
  }
`;

export const packageDetail = `
  query packageDetail($_id: String!) {
    packageDetail(_id: $_id) {
      ${packageFields}
    }
  }
`;

export const investments = `
  query investments($saashqCustomerId: String) {
    investments(saashqCustomerId: $saashqCustomerId) {
      _id
      saashqCustomerId
      packageId
      createdAt
      modifiedAt
      amount

      package { _id, name }
    }
  }
`;

const getBalance = `
  query Query($saashqCustomerId: String) {
    getBalance(saashqCustomerId: $saashqCustomerId)
}
`;

const isVerified = `
  query Query($saashqCustomerId: String) {
    isVerified(saashqCustomerId: $saashqCustomerId)
}
`;

export default {
  packages,
  packageCounts,
  packageDetail,

  investments,
  getBalance,
  isVerified
};
