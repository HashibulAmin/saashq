"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
const dashboardTypeDefs_1 = require("./dashboardTypeDefs");
const typeDefs = async (serviceDiscovery) => {
    const tagsAvailable = await serviceDiscovery.isEnabled('tags');
    return (0, graphql_tag_1.default) `
  scalar JSON
  scalar Date
  
  ${(0, dashboardTypeDefs_1.types)(tagsAvailable)}
  
  extend type Query {
    ${dashboardTypeDefs_1.queries}
  }
  
  extend type Mutation {
    ${dashboardTypeDefs_1.mutations}
  }
  `;
};
exports.default = typeDefs;
