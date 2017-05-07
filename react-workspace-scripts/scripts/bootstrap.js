
var spawn = require('child_process').spawn;

module.exports = function(args) {

  spawn('lerna', ['bootstrap'], { stdio: 'inherit' });
};
