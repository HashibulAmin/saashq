"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateModels = exports.loadClasses = exports.models = void 0;
const Dashboard_1 = require("./models/Dashboard");
const core_1 = require("@erxes/api-utils/src/core");
exports.models = null;
const loadClasses = (db) => {
    exports.models = {};
    exports.models.Dashboards = db.model('dashboards', (0, Dashboard_1.loadDashboardClass)(exports.models));
    exports.models.DashboardItems = db.model('dashboard_items', (0, Dashboard_1.loadDashboardItemClass)(exports.models));
    return exports.models;
};
exports.loadClasses = loadClasses;
exports.generateModels = (0, core_1.createGenerateModels)(exports.models, exports.loadClasses);
