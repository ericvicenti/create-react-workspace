#!/usr/bin/env node

var command = process.argv[2];
var args = process.argv.slice(3);

switch (command) {
  case "start":
    return require('../scripts/start')(args);
  case "bootstrap":
    return require('../scripts/bootstrap')(args);
  case "create-web-app":
    return require('../scripts/create-web-app')(args);
  case "create-native-app":
    return require('../scripts/create-native-app')(args);
  case "ios":
    return require('../scripts/ios')(args);
  case "android":
    return require('../scripts/android')(args);
  case "create-library":
    return require('../scripts/create-library')(args);
  case "upgrade":
  case "eject":
    console.log(command + " command has not been implemented.");
    break;
  default:
    console.error('Unknown command');
}
