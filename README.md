# Create React Workspace

Develop and share code between react web apps, react native apps, and standalone libraries.

> Warning: This is a super early alpha and anything could break. Please provide feedback and consider jumping into the code and contributing!

Under the hood, this uses create-react-app, haul, lerna, and react-native-cli, although the dependencies may change over time.

## Create a new workspace

```
npm install -g create-react-workspace
cd ~
create-react-workspace dev
cd dev
# Optionally, `git init`
```

## Create a web app

```
npm run create-web-app MyWebApp
# The app will be created in ~/dev/my-web-app
```

At this point, you can `cd my-web-app` and run `npm start` or anything else that `create-react-app` supports.

If you want to develop the app alongside local dependencies, you can:

```
cd ~/dev
npm start my-web-app
# The app will run, as well as the packager for the app's local dependencies
```

## Create a native app

```
npm run create-native-app MyNativeApp
# The app will be created in my-native-app
cd mynativeapp
npm run ios
npm run android
```

At this point, you can `cd ~/dev/my-native-app` and run `react-native run-ios`, `react-native run-android` or anything else that `react-native` supports.

If you want to develop the app alongside local dependencies, you can:

```
cd ~/dev
npm start my-native-app
# The dev server will run, as well as the packager for the app's local dependencies
```

## Create a local library for shared code

If you want to share logic or components between several apps, you can create a library and optionally publish it to npm.

```
npm run create-library MyLibrary
# The library will be created in ~/dev/my-library
```

Now you can `cd ~/dev/my-library` and run `npm build` and `npm test` to develop the library.

### Link a local library into an app

If you want to use the library from other packages in the workspace:

Add the dependency to `~/dev/my-web-app/package.json` or `~/dev/my-native-app/package.json`
```
 ...
 "dependencies": {
   "my-library": "",
   ...
```

Now, from `~/dev`, run:

```
npm run bootstrap
```

### Run and develop an app

To run an app and all the bootstraped dependencies:

```
npm start my-native-app my-web-app
# both apps will start, and they will handle changes from my-library any other local dependencies!
```

## Coming soon (help wanted!)

- Eject
- Upgrade
- Windows support
- Jest tests
- Prettier
- Flow
- e2e tests for the workspace
- Improved errors and docs
