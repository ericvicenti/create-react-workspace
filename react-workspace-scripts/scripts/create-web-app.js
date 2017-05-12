var spawn = require("child_process").spawn;
var fs = require("fs");
var cwd = process.cwd();
var changeCase = require("change-case");
var join = require("path").join;
var utils = require('../utils');

module.exports = function(args) {
  var lernaFile = join(cwd, "lerna.json");
  var appModuleName = changeCase.paramCase(args[0]);
  var appDir = join(cwd, appModuleName);
  if (fs.existsSync(appDir)) {
    throw new Error("App directory already exists!");
  }
  if (!appModuleName) {
    throw new Error("App name is mandatory!");
  }
  utils.addToLerna(appModuleName);
  spawn("create-react-app", [appModuleName], { stdio: "inherit" });
};
