const configs = require("./src/configs");
const pluginWebpack = require('@saashq/ui/plugin.webpack.config');

module.exports = pluginWebpack(configs);