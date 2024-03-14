"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashboardMutaions_1 = require("./dashboardMutaions");
const dashboardQueries_1 = require("./dashboardQueries");
const customScalars_1 = require("@saashq/api-utils/src/customScalars");
const dashboard_1 = require("./dashboard");
const resolvers = {
    ...customScalars_1.default,
    Dashboard: dashboard_1.default,
    Mutation: {
        ...dashboardMutaions_1.default
    },
    Query: {
        ...dashboardQueries_1.default
    }
};
exports.default = resolvers;
