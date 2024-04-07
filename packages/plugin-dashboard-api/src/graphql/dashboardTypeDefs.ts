export const types = (tagsAvailable) => `

  ${
    tagsAvailable
      ? `
      extend type Tag @key(fields: "_id"){
        _id: String! @external
      }
    `
      : ``
  }

  extend type User @key(fields: "_id") {
    _id: String! @external
  }

  type Dashboardz {
    _id: String!
    name: String
    visibility: String
    selectedMemberIds: [String]
    description: String
    parentId: String
    childsDashboard: [Dashboardz]
    order: String
    dashboardCount: Int
    relatedIds: [String]
    createdAt: Date
    updatedAt: Date
    createdBy: User
    updatedBy: User
    tagIds: [String]
    departmentIds: [String]

    ${tagsAvailable ? `getTags: [Tag]` : ''}
    createdUser: User
    updatedUser: User
    members: [User]
    itemsCount: Int
  } 

  type DashboardItem {
    _id: String!
    dashboardId: String
    layout: String
    vizState: String
    name: String
    type: String
    isDateRange: Boolean
  }

  type DashboardListResponsez {
    list: [Dashboardz],
    totalCount: Int,
  }
`;

const queryParams = `
  page: Int
  perPage: Int
  ids: [String]
  excludeIds: Boolean
  searchValue: String
  sortField: String
  sortDirection: Int
  tag: String
  departmentId: String
`;

export const queries = `
  dashboardz(${queryParams}): [Dashboardz]
  dashboardsMain(${queryParams}): DashboardListResponsez
  dashboardDetails(_id: String!): Dashboardz
  dashboardsTotalCount: Int
  dashboardCountByTags : JSON
  dashboardItems(dashboardId: String!): [DashboardItem]
  dashboardItemDetail(_id: String!): DashboardItem
  dashboardGetTypes: [String]
`;

export const mutations = `
  dashboardsAdd(name: String, description: String, visibility: String, selectedMemberIds: [String], departmentIds: [String], parentId: String): Dashboardz
  dashboardsEdit(_id: String!, name: String, description: String, visibility: String, selectedMemberIds: [String], departmentIds: [String], parentId: String): Dashboardz
  dashboardsRemove(dashboardIds: [String]): JSON
  dashboardItemsAdd(dashboardId: String, layout: String, vizState: String, name: String, type: String, isDateRange: Boolean): DashboardItem
  dashboardItemsEdit(_id: String!, dashboardId:String, layout: String, vizState: String, name: String, type: String): DashboardItem
  dashboardItemsRemove(_id: String!): String
  renderDashboard: String
`;
