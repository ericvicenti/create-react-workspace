
var spawn = require('child_process').spawn;
var cwd = process.cwd();

module.exports = function(args) {
  console.log('Running lerna in '+cwd);
  spawn('lerna', ['bootstrap'], { stdio: 'inherit', cwd: cwd });
};
