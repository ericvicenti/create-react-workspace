var execFileSync = require('child_process').execFileSync;
var join = require('path').join;
var fs = require('fs');
var cwd = process.cwd();
var assetsDir = join(__dirname, '..', 'assets');
var libraryGitIgnore = fs.readFileSync(join(assetsDir, 'library.gitignore'), {encoding: 'utf8'});
var libraryPackage = fs.readFileSync(join(assetsDir, 'library.package.json'), {encoding: 'utf8'});
var libraryMainFile = fs.readFileSync(join(assetsDir, 'library.LibName.js'), {encoding: 'utf8'});


module.exports = function(args) {
  var libName = args[0];
  if (!libName) {
    throw new Error('Cannot create new library without a name');
  }
  console.log('Creating library '+libName);
  var libDir = join(cwd, libName);
  var lernaFile = join(cwd, 'lerna.json');
  var packagePath = join(libDir, 'package.json');
  var gitignorePath = join(libDir, '.gitignore');
  var packageData = libraryPackage.split('LibName').join(libName);
  var srcDir = join(libDir, 'src');
  var mainFilePath = join(srcDir, libName+'.js');
  var mainFileData = libraryMainFile.split('LibName').join(libName);
  execFileSync('mkdir', [libDir], {});
  execFileSync('mkdir', [srcDir], {});
  fs.writeFileSync(packagePath, packageData);
  var lernaConfig = JSON.parse(fs.readFileSync(lernaFile));
  lernaConfig.packages = lernaConfig.packages.concat(libName);
  fs.writeFileSync(lernaFile, JSON.stringify(lernaConfig, null, 2));
  fs.writeFileSync(gitignorePath, libraryGitIgnore);
  fs.writeFileSync(mainFilePath, mainFileData);
}
