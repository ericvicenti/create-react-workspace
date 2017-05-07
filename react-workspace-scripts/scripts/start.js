var cwd = process.cwd();
var spawn = require("child_process").spawn;
var join = require("path").join;
var fs = require("fs");

var lernaFile = join(cwd, "lerna.json");
var lernaConfig = JSON.parse(fs.readFileSync(lernaFile, { encoding: "utf8" }));
var allPackages = lernaConfig.packages;

module.exports = function(args) {
  var packagesToStart = args;
  var packagesToCrawl = packagesToStart.slice();
  while (packagesToCrawl.length) {
    var packageToCrawl = packagesToCrawl[packagesToCrawl.length - 1];
    packagesToCrawl.splice(packagesToCrawl.length - 1, 1);
    var packageJSON = JSON.parse(
      fs.readFileSync(join(cwd, packageToCrawl, "package.json"), {
        encoding: "utf8"
      })
    );
    var packageDeps = Object.keys(packageJSON.dependencies);
    if (packageJSON.devDependencies) {
      packageDeps = packageDeps.concat(
        Object.keys(packageJSON.devDependencies)
      );
    }
    var morePackagesToStart = packageDeps.filter(function(depName) {
      return !!depName &&
        allPackages.indexOf(depName) !== -1 &&
        packagesToStart.indexOf(depName) === -1;
    });
    if (morePackagesToStart.length) {
      packagesToCrawl = packagesToCrawl.concat(morePackagesToStart);
      packagesToStart = packagesToStart.concat(morePackagesToStart);
    }
  }

  console.log("Starting " + packagesToStart.join() + " from " + cwd);

  var children = packagesToStart.map(packageName =>
    spawn("npm", ["start"], {
      cwd: join(cwd, packageName),
      stdio: ["inherit", "inherit", "inherit"]
    }));
};
