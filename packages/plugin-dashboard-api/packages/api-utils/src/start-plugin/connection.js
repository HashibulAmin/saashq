"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = exports.connect = exports.connectionOptions = void 0;
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const debuggers_1 = require("./debuggers");
const utils_1 = require("./utils");
dotenv.config();
// mongoose.Promise = global.Promise;
const MONGO_URL = (0, utils_1.getEnv)({ name: 'MONGO_URL' });
exports.connectionOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    // autoReconnect: true,
    family: 4,
    useFindAndModify: false
};
mongoose.connection
    .on('connected', () => {
    (0, debuggers_1.debugInfo)(`Connected to the database: ${MONGO_URL}`);
})
    .on('disconnected', () => {
    (0, debuggers_1.debugInfo)(`Disconnected from the database: ${MONGO_URL}`);
    process.exit(1);
})
    .on('error', error => {
    (0, debuggers_1.debugError)(`Database connection error: ${MONGO_URL} ${error}`);
    process.exit(1);
});
const connect = (URL) => {
    return mongoose.connect(URL || MONGO_URL, exports.connectionOptions);
};
exports.connect = connect;
function disconnect() {
    return mongoose.connection.close();
}
exports.disconnect = disconnect;
