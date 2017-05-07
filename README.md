# Create React Workspace

Configuration-free monorepos.

> Warning: This is a super early alpha. Please provide feedback and consider jumping into the code and contributing!

## Create a new workspace

```
npm install -g create-react-workspace
create-react-workspace myProject
cd myProject
```

## Create a library for shared code

```
npm run create-library my-lib
```

## Create a web app

```
npm run create-web-app my-web-app
```

## Create a native app

```
npm run create-native-app mynativeapp
cd mynativeapp
npm run ios
npm run android
```


## Add and link dependencies

In the `package.json` of an app or library, add the desired sibling dependencies with a compatible version number.

Then, in the root of the project, run:

```
npm run bootstrap
```

## Run and develop an app

To run an app and all the bootstraped dependencies:

```
npm start mynativeapp my-web-app
# both apps will start, plus the watcher for any local dependencies!
```

## Coming soon (help wanted!)

- Publish a library
- Jest
- Flow
