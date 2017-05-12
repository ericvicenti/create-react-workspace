
var spawn = require('child_process').spawn;
var join = require('path').join;
var cwd = process.cwd();

module.exports = function(args) {
  var appName = args[0];
  spawn('npm', ['run', 'android'], { stdio: 'inherit', cwd: join(cwd, appName), env: { RCT_NO_LAUNCH_PACKAGER: 'true'} });
};
