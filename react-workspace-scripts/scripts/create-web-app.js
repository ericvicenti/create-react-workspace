var spawn = require("child_process").spawn;
var fs = require("fs");
var cwd = process.cwd();
var changeCase = require("change-case");
var join = require("path").join;
var utils = require('../utils');

module.exports = function(args) {
  var appModuleName = changeCase.paramCase(args[0]);
  var appDir = join(cwd, appModuleName);
  if (fs.existsSync(appDir)) {
    throw new Error("App directory already exists!");
  }
  if (!appModuleName) {
    throw new Error("App name is mandatory!");
  }

  var craCLI = join(__dirname, '..', '..', 'create-react-app', 'index.js');
  console.log('Installing dependencies, this may take a minute. '+utils.yarnMessage);
  spawn(craCLI, [appModuleName], {
    stdio: 'inherit'
  }).on('exit', function() {
    console.log('Done!')
  });
};
