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

  type Dashboard2 {
    _id: String!
    name: String
    visibility: VisibilityType2
    selectedMemberIds: [String]
    description: String
    parentId: String
    childsDashboard: [Dashboard]
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

  enum VisibilityType2 {
    PUBLIC
    PRIVATE
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

  type DashboardListResponse2 {
    list: [Dashboard],
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
  dashboards(${queryParams}): [Dashboard2]
  dashboardsMain(${queryParams}): DashboardListResponse2
  dashboardDetails(_id: String!): Dashboard2
  dashboardsTotalCount: Int
  dashboardCountByTags : JSON
  dashboardItems(dashboardId: String!): [DashboardItem]
  dashboardItemDetail(_id: String!): DashboardItem
  dashboardGetTypes: [String]
`;

export const mutations = `
  dashboardsAdd(name: String, description: String, visibility: String, selectedMemberIds: [String], departmentIds: [String], parentId: String): Dashboard
  dashboardsEdit(_id: String!, name: String, description: String, visibility: String, selectedMemberIds: [String], departmentIds: [String], parentId: String): Dashboard
  dashboardsRemove(dashboardIds: [String]): JSON
  dashboardItemsAdd(dashboardId: String, layout: String, vizState: String, name: String, type: String, isDateRange: Boolean): DashboardItem
  dashboardItemsEdit(_id: String!, dashboardId:String, layout: String, vizState: String, name: String, type: String): DashboardItem
  dashboardItemsRemove(_id: String!): String
  renderDashboard: String
`;
