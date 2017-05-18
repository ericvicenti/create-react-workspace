var cwd = process.cwd();
var spawn = require("child_process").spawn;
var join = require("path").join;
var fs = require("fs");

var allPackages = fs
  .readdirSync(cwd)
  .filter(
    pkg =>
      pkg[0] !== "." &&
      pkg !== "package.json" &&
      pkg !== "node_modules" &&
      pkg !== "yarn.lock"
  );

function readPackageJSON(pkgName) {
  var packageJSON = JSON.parse(
    fs.readFileSync(join(cwd, pkgName, "package.json"), {
      encoding: "utf8"
    })
  );
  return packageJSON;
}

function writePackageJSON(pkgName, jsonData) {
  fs.writeFileSync(
    join(cwd, pkgName, "package.json"),
    JSON.stringify(jsonData, null, 2)
  );
}

function crawlPackage(pkgName) {
  var packageJSON = readPackageJSON(pkgName);
  var dependencies = packageJSON.dependencies || {};
  var devDependencies = packageJSON.devDependencies || {};
  var isReactNative = !!dependencies["react-native"];
  var isCRA = !!devDependencies["react-scripts"];
  var packageDeps = Object.keys(dependencies);
  var localDeps = packageDeps.filter(dep => allPackages.indexOf(dep) !== -1);
  var crawledLocalDeps = localDeps.map(crawlPackage);
  var allLocalDependencies = localDeps.slice();
  crawledLocalDeps.forEach(crawledChild => {
    allLocalDependencies = allLocalDependencies.concat(crawledChild.allLocalDependencies);
  });
  allLocalDependencies = allLocalDependencies.filter(function(item, i, ar){ return ar.indexOf(item.name) === i.name; });
  return {
    packageJSON: packageJSON,
    name: pkgName,
    allLocalDependencies: allLocalDependencies,
    localDependencies: crawledLocalDeps,
    isReactNative: isReactNative,
    isCRA: isCRA
  };
}

function writeRelativeDependencies(crawled) {
  var deps = Object.assign({}, crawled.packageJSON.dependencies);
  Object.keys(deps).forEach(dep => {
    if (allPackages.indexOf(dep !== -1)) {
      deps[dep] = '../'+dep;
    }
  });
  var devDeps = Object.assign({}, crawled.packageJSON.devDependencies);
  Object.keys(devDeps).forEach(dep => {
    if (allPackages.indexOf(dep !== -1)) {
      devDeps[dep] = '../'+dep;
    }
  });
  var newPkg = Object.assign({}, crawled.packageJSON, {
    dependencies: deps,
    devDependencies: devDeps,
  });
  writePackageJSON(crawled.name, newPkg);
}

function undoRelativeDependencies(crawled) {
  writePackageJSON(crawled.name, crawled.packageJSON);

}

module.exports = function(args) {
  console.log("all packages are..", allPackages);
  console.log("we should link at this time!!!");

  var appToStart = args[0];
  var crawledApp = crawlPackage(appToStart);


  if (crawledApp.isReactNative) {
    console.log("Starting React Native app '"+appToStart+"'", crawledApp.allLocalDependencies);
    writeRelativeDependencies(crawledApp);

    //   spawn("npm", ["start"], {
    //     cwd: join(cwd, packageName),
    //     stdio: ["inherit", "inherit", "inherit"]
    //   }));
    // undoRelativeDependencies(crawledApp);
  } else if (crawledApp.isCRA) {
    console.log("Starting React Web app '"+appToStart+"'", crawledApp.allLocalDependencies);
  } else {
    console.error(
      "Can only start react native apps or web apps created with create-react-app"
    );
    process.exit(1);
  }

  // pproposed strategy: rewrite all local deps to be relative, run linklocal, undo deps changes
  //
  // var packagesToStart = [appToStart];
  //
  // while (depsToCrawl.length) {
  //   var packageToCrawl = depsToCrawl[depsToCrawl.length - 1];
  //   depsToCrawl.splice(depsToCrawl.length - 1, 1);
  //   var packageJSON = JSON.parse(
  //     fs.readFileSync(join(cwd, packageToCrawl, "package.json"), {
  //       encoding: "utf8"
  //     })
  //   );
  //   var packageDeps = packageJSON.dependencies ? Object.keys(packageJSON.dependencies) : [];
  //   if (packageJSON.devDependencies) {
  //     packageDeps = packageDeps.concat(
  //       Object.keys(packageJSON.devDependencies)
  //     );
  //   }
  //   var morePackagesToStart = packageDeps.filter(function(depName) {
  //     return !!depName &&
  //       allPackages.indexOf(depName) !== -1 &&
  //       packagesToStart.indexOf(depName) === -1;
  //   });
  //   if (morePackagesToStart.length) {
  //     depsToCrawl = depsToCrawl.concat(morePackagesToStart);
  //     packagesToStart = packagesToStart.concat(morePackagesToStart);
  //   }
  // }
  //
  // console.log("Starting " + packagesToStart.join() + " from " + cwd);
  //
  // packagesToStart.forEach(packageName => {
  //   var clearConsoleFile = join(cwd, packageName, 'node_modules', 'react-dev-utils', 'clearConsole.js');
  //   if (fs.existsSync(clearConsoleFile)) {
  //     fs.writeFileSync(clearConsoleFile, 'module.exports = function() {};');
  //   }
  //   var clearConsoleFile2 = join(cwd, packageName, 'node_modules', 'clear', 'index.js');
  //   if (fs.existsSync(clearConsoleFile2)) {
  //     fs.writeFileSync(clearConsoleFile2, 'module.exports = function() {};');
  //   }
  // });

  // todo: if this package is RN, just run build on deps, run npm i, then rn start

  // var children = packagesToStart.map(packageName =>
  //   spawn("npm", ["start"], {
  //     cwd: join(cwd, packageName),
  //     stdio: ["inherit", "inherit", "inherit"]
  //   }));
};
