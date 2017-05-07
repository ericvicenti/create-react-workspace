var spawn = require("child_process").spawn;
var fs = require("fs");
var join = require("path").join;
var cwd = process.cwd();
var assetsDir = join(__dirname, '..', 'assets');
var haulFile = fs.readFileSync(join(assetsDir, 'webpack.haul.js'), {encoding: 'utf8'});

module.exports = function(args) {
  var lernaFile = join(cwd, "lerna.json");
  var appName = args[0];
  var appDir = join(cwd, appName);
  var appPackagePath = join(appDir, "package.json");
  var appPackagePath;
  if (fs.existsSync(appDir)) {
    throw new Error("App directory already exists!");
  }
  if (!appName) {
    throw new Error("App name is mandatory!");
  }
  var lernaConfig = JSON.parse(fs.readFileSync(lernaFile));
  lernaConfig.packages = lernaConfig.packages.concat(appName);
  fs.writeFileSync(lernaFile, JSON.stringify(lernaConfig));
  spawn("react-native", ["init", appName], {
    stdio: "inherit"
  }).on("exit", function() {
    var appPackage = JSON.parse(
      fs.readFileSync(appPackagePath, { encoding: "utf8" })
    );
    fs.writeFileSync(join(appDir, 'webpack.haul.js'), haulFile);
    appPackage.devDependencies["haul-cli"] = "^0.5.0";
    appPackage.scripts.start = "haul start --platform all";
    appPackage.scripts.ios = "RCT_NO_LAUNCH_PACKAGER=true react-native run-ios";
    appPackage.scripts.android = "RCT_NO_LAUNCH_PACKAGER=true react-native run-android";
    fs.writeFileSync(appPackagePath, JSON.stringify(appPackage, null, 2));
    spawn("npm", ["i"], { cwd: appDir, stdio: "inherit" });
  });
};
