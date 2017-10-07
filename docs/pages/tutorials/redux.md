Overview
========
Redux is used internally by the SDK to manage state.

## Configuring
The SDK store is created with the `configureStore()` function, which must be passed to the `DeskproSDK` component via the `store` prop.

```js
import ReactDOM from 'react-dom';
import { DeskproSDK, configureStore } from 'deskpro-sdk-react';

const store = configureStore(dpapp);

export function runApp(dpapp) {
  ReactDOM.render(
    <DeskproSDK dpapp={dpapp} store={store}>
      <App />
    </DeskproSDK>,
    document.getElementById('deskpro-app')
  );
}
```

## Middleware
The store may be configured with additional middleware by passing an array of functions as the second argument to `configureStore()`. ([Thunk](https://github.com/gaearon/redux-thunk) is included by default.)

```js
import { configureStore } from 'deskpro-sdk-react';
import logger from 'redux-logger';
import analytics from 'redux-analytics';

const store = configureStore(dpapp, [logger, analytics]);
```

## Reducers
Additional reducers may also be passed to the `configureStore()` function.

```js
import { configureStore } from 'deskpro-sdk-react';

const customReducer = (state, action) => {
    return state;
}
const store = configureStore(dpapp, {
    custom: customReducer
});
```

Initial state for the custom reducers may also be passed to the `configureStore()` function.

```js
import { configureStore } from 'deskpro-sdk-react';

const customReducer = (state, action) => {
    return state;
}
const reducers = {
    custom: customReducer
}
const initialState = {
    custom: { foo: 'bar' }
}
const store = configureStore(dpapp, reducers, initialState);
```

**Note:**  
The middleware argument may be omitted when not used. Although the following example is still valid.

```jsx
const store = configureStore(dpapp, [], reducers, initialState);
```


## Examples
The following example uses middleware, reducers, and initial state.

```js
import ReactDOM from 'react-dom';
import { DeskproSDK, configureStore } from 'deskpro-sdk-react';
import logger from 'redux-logger';
import analytics from 'redux-analytics';

const customReducer = (state, action) => {
    return state;
}
const reducers = {
    custom: customReducer
}
const initialState = {
    custom: { foo: 'bar' }
}
const store = configureStore(dpapp, [logger, analytics], reducers, initialState);

export function runApp(dpapp) {
  ReactDOM.render(
    <DeskproSDK dpapp={dpapp} store={store}>
      <App />
    </DeskproSDK>,
    document.getElementById('deskpro-app')
  );
}
```

## Debugging
The SDK automatically enables support for the [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension) when running in the "development" environment. The extension allows developers to view, modify, and playback the redux state, and it runs in Chrome, Firefox, and other browsers.

![screenshot](https://cloud.githubusercontent.com/assets/7957859/18002950/aacb82fc-6b93-11e6-9ae9-609862c18302.png)
