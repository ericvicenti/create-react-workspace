var spawn = require("child_process").spawn;
var fs = require("fs");
var cwd = process.cwd();
var join = require("path").join;

module.exports = function(args) {
  var lernaFile = join(cwd, "lerna.json");
  var appName = args[0];
  var appDir = join(cwd, appName);
  if (fs.existsSync(appDir)) {
    throw new Error("App directory already exists!");
  }
  if (!appName) {
    throw new Error("App name is mandatory!");
  }
  var lernaConfig = JSON.parse(fs.readFileSync(lernaFile));
  lernaConfig.packages = lernaConfig.packages.concat(appName);
  fs.writeFileSync(lernaFile, JSON.stringify(lernaConfig));
  spawn("create-react-app", [appName], { stdio: "inherit" });
};
