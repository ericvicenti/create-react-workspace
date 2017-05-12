var execFileSync = require('child_process').execFileSync;
var join = require('path').join;
var fs = require('fs');

var shouldUseYarn = false;
try {
  execFileSync('yarnpkg' , ['--version'], { stdio: 'ignore' });
  shouldUseYarn = true;
} catch (e) {

}

var cwd = process.cwd();
var lernaFile = join(cwd, 'lerna.json');

function addToLerna(moduleName) {
  var lernaConfig = JSON.parse(fs.readFileSync(lernaFile));
  if (lernaConfig.packages.indexOf(moduleName) === -1) {
    lernaConfig.packages = lernaConfig.packages.concat(moduleName);
    fs.writeFileSync(lernaFile, JSON.stringify(lernaConfig, null, 2));
  }
}

var yarnMessage = shouldUseYarn ? '' : ' It will be faster if you install yarn (yarnpkg.org)';

module.exports = {
  addToLerna: addToLerna,
  shouldUseYarn: shouldUseYarn,
  npmCommandToUse: shouldUseYarn ? 'yarnpkg' : 'npm',
  yarnMessage: yarnMessage,
};
