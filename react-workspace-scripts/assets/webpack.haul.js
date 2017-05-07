const path = require("path");

module.exports = ({ platform }, defaults) => ({
  entry: `./index.${platform}.js`,
  resolve: {
    ...defaults.resolve,
    alias: {
      "react-native": path.resolve(__dirname, "node_modules/react-native")
    }
  }
});
