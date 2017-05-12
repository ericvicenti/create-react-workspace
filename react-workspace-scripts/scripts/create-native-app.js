var spawn = require("child_process").spawn;
var execFileSync = require("child_process").execFileSync;
var fs = require("fs");
var changeCase = require("change-case");
var join = require("path").join;
var cwd = process.cwd();
var assetsDir = join(__dirname, '..', 'assets');
var haulFile = fs.readFileSync(join(assetsDir, 'webpack.haul.js'), {encoding: 'utf8'});
var utils = require('../utils');
var chalk = require('chalk');
var os = require('os');
var dedent = require('dedent');

module.exports = function(args) {
  var appName = changeCase.pascalCase(args[0]);
  var appModuleName = changeCase.paramCase(args[0]);
  var tmpdir = join(os.tmpdir(), 'create-'+Date.now());
  var appDir = join(tmpdir, appName);
  var appFinalDir = join(cwd, appModuleName);
  var appPackagePath = join(appDir, "package.json");
  if (!appName) {
    console.error('Please specify a name for the new native app:');
    console.log(
      `  ${utils.npmCommandToUse} run create-native-app ${chalk.green('<native-project-name>')}`
    );
    console.log();
    console.log('For example:');
    console.log(`  ${utils.npmCommandToUse} run create-native-app ${chalk.green('great-app')}`);
    process.exit(1);
  }
  if (fs.existsSync(appFinalDir)) {
    console.error('App directory "'+appFinalDir+'" already exists. Please use a different name.');
    process.exit(1);
  }
  console.log('Creating native app '+chalk.green(appName)+' at '+chalk.green('./'+appModuleName));
  execFileSync('mkdir', ['-p', tmpdir]);
  console.log('Installing dependencies, this may take a minute. '+utils.yarnMessage);
  spawn("react-native", ["init", appName, '--version=0.43.4'], {
    cwd: tmpdir,
    // stdio: "inherit"
  }).on("exit", function() {
    console.log('Configuring packager.');
    var appPackage = JSON.parse(
      fs.readFileSync(appPackagePath, { encoding: "utf8" })
    );
    fs.writeFileSync(join(appDir, 'webpack.haul.js'), haulFile);
    var devDependencies = appPackage.devDependencies || (appPackage.devDependencies = {});
    devDependencies["haul-cli"] = "^0.5.0";
    appPackage.scripts.start = "haul start --platform all";
    appPackage.scripts.ios = "RCT_NO_LAUNCH_PACKAGER=true react-native run-ios";
    appPackage.scripts.android = "RCT_NO_LAUNCH_PACKAGER=true react-native run-android";
    fs.writeFileSync(appPackagePath, JSON.stringify(appPackage, null, 2));
    const gitignorePath = join(appDir, '.gitignore');
    const gitignoreFile = fs.readFileSync(gitignorePath, {encoding: 'utf8'}) + '\n\n.happypack\n';
    fs.writeFileSync(gitignorePath, gitignoreFile);
    spawn(utils.npmCommandToUse, ['install'], { cwd: appDir }).on("exit", function() {
      execFileSync('mv', [ appDir, appFinalDir ]);
      utils.addToLerna(appModuleName);
      console.log('Native app created at ./'+appModuleName);
    });
  });
};
