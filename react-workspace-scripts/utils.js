var execFileSync = require('child_process').execFileSync;
var join = require('path').join;
var fs = require('fs');

var shouldUseYarn = false;
try {
  execFileSync('yarnpkg' , ['--version'], { stdio: 'ignore' });
  shouldUseYarn = true;
} catch (e) {}

var yarnMessage = shouldUseYarn ? '' : ' It will be faster if you install yarn (yarnpkg.org)';

// TODO: Test yarn extensively and add official support
yarnMessage = '';
shouldUseYarn = false;

module.exports = {
  shouldUseYarn: shouldUseYarn,
  npmCommandToUse: shouldUseYarn ? 'yarnpkg' : 'npm',
  yarnMessage: yarnMessage,
};
