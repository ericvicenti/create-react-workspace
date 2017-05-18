# Create React Workspace

Develop and share code between React web apps, React Native apps, and standalone libraries/components.

> Warning: This is a super early alpha and anything could break. Please provide feedback and consider jumping into the code and contributing!

Under the hood, this uses create-react-app, and react-native-cli, although the dependencies may change over time.

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
npm run create-web-app my-web-app
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
npm run create-native-app my-native-app
# The app will be created in my-native-app
cd my-native-app
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

If you want to share JS logic or components between several apps:

```
npm run create-library my-library
# The library will be created in ~/dev/my-library
```

Now you can `cd ~/dev/my-library` and run `npm build` and `npm test` to develop the library.

### Link a local library into an app

If you want to use the library from other packages in the workspace:

Add the dependency to `~/dev/my-web-app/package.json` or `~/dev/my-native-app/package.json`
```
 ...
 "dependencies": {
   "my-library": "0.0.1",
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

## Help Wanted!

Submit an issue to let us know what you're up to, and get to work! The following improvements would be rapidly accepted:

- Windows support
- Jest tests
- Prettier
- Flow
- Eject ala create-react-app
- Upgrade ala create-react-app
- Refactor: directly integrate with create-react-app and react-native-init
- Support create-react-native-app. Blocked by current usage of Haul
- Upgrade to RN 0.44. Blocked by brokenness of Haul on Android
- e2e tests for the workspace
- Improved errors and docs
- Split out create-library and create-component
- Add storybook support to create-component

These roadmap items are more complicated, so please open issues to discuss:

- Switch to react-primitives for library dependency, rather than react-dom+react-native+react-native-web
- Either improve integration of haul/webpack for React Native, or use the React Native packager for symlinks+web
- Support publishing and release workflows
