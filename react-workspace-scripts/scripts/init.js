var fs = require('fs');
var path = require('path');
var scriptsPkgJSON = require('../package.json');
var execFileSync = require('child_process').execFileSync;
var utils = require('../utils');

function stringify(data) {
  return JSON.stringify(data, null, 2);
}

module.exports = function(root, workspaceName, verbose, originalDirectory, template) {

  var babelRC = {
    "presets": [
      [ "es2015", { "loose": true } ],
      "stage-0",
      "react"
    ],
    "plugins": [
      "transform-decorators-legacy",
    ],
    "env": {
      "production": {
        "plugins": [
          "transform-es2015-modules-commonjs",
          "transform-react-remove-prop-types",
          "transform-react-constant-elements",
          "transform-react-inline-elements",
          "transform-runtime",
          "transform-decorators-legacy",
        ],
      },
      "test": {
        "plugins": [
          "transform-es2015-modules-commonjs"
        ]
      }
    }
  };
  var packageJSON = {
    "devDependencies": {
      "babel-cli": "^6.24.1",
      "babel-core": "^6.24.1",
      "babel-loader": "^7.0.0",
      "babel-plugin-transform-decorators-legacy": "^1.3.4",
      "babel-plugin-transform-runtime": "^6.23.0",
      "babel-preset-es2015": "^6.24.1",
      "babel-preset-react": "^6.24.1",
      "babel-preset-stage-0": "^6.24.1",
      "react-workspace-scripts": scriptsPkgJSON.version
    },
    "scripts": {
      "upgrade": "react-workspace-scripts upgrade",
      "start": "react-workspace-scripts start",
      "create-web-app": "react-workspace-scripts create-web-app",
      "create-native-app": "react-workspace-scripts create-native-app",
      "ios": "react-workspace-scripts ios",
      "android": "react-workspace-scripts android",
      "create-library": "react-workspace-scripts create-library",
      "eject": "react-workspace-scripts eject"
    }
  };
  fs.writeFileSync(path.join(root, '.babelrc'), stringify(babelRC));
  fs.writeFileSync(path.join(root, '.gitignore'), '.DS_Store\nnode_modules\nnpm-debug.log');
  fs.writeFileSync(path.join(root, 'package.json'), stringify(packageJSON));
  execFileSync(utils.npmCommandToUse, ['install'], {
    cwd: root,
    stdio: 'inherit',
  });

  console.log('Workspace initialized! ');
}
