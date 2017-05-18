var execFileSync = require('child_process').execFileSync;
var spawn = require("child_process").spawn;
var join = require('path').join;
var changeCase = require('change-case');
var fs = require('fs');
var cwd = process.cwd();
var assetsDir = join(__dirname, '..', 'assets');
var libraryGitIgnore = fs.readFileSync(join(assetsDir, 'library.gitignore'), {encoding: 'utf8'});
var libraryPackage = fs.readFileSync(join(assetsDir, 'library.package.json'), {encoding: 'utf8'});
var libraryMainFile = fs.readFileSync(join(assetsDir, 'library.LibName.js'), {encoding: 'utf8'});
var utils = require('../utils');

module.exports = function(args) {
  var libName = args[0];
  if (!libName) {
    throw new Error('Cannot create new library without a name');
  }
  var libName = changeCase.pascalCase(args[0]);
  var libModuleName = changeCase.paramCase(args[0]);

  function replaceString(input) {
    return input
      .split('lib-name').join(libModuleName)
      .split('LibName').join(libName);
  }
  console.log('Creating library '+libName+' at ./'+libModuleName);
  var libDir = join(cwd, libModuleName);
  var packagePath = join(libDir, 'package.json');
  var gitignorePath = join(libDir, '.gitignore');
  var packageData = replaceString(libraryPackage);
  var srcDir = join(libDir, 'src');
  var mainFilePath = join(srcDir, libName+'.js');
  var mainFileData = replaceString(libraryMainFile);
  execFileSync('mkdir', [libDir], {});
  execFileSync('mkdir', [srcDir], {});
  fs.writeFileSync(packagePath, packageData);
  fs.writeFileSync(gitignorePath, libraryGitIgnore);
  fs.writeFileSync(mainFilePath, mainFileData);
  spawn(utils.npmCommandToUse, ['install'], {cwd: libDir, stdio: 'inherit'});
}
