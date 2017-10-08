Overview
========
[Redux](http://redux.js.org/) is used internally by the SDK to manage state. Its usage has been hidden away to make the SDK user friendly, but it may be used by developers in need of a centralized store.

## Configuring
The SDK store is created by the `configureStore()` function, and the store object must be passed to the `DeskproSDK` component via the `store` prop.

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
The store may be configured with additional middleware by passing an array of functions as the second argument to `configureStore()`.

```js
import { configureStore } from 'deskpro-sdk-react';
import logger from 'redux-logger';
import analytics from 'redux-analytics';

const store = configureStore(dpapp, [logger, analytics]);
```

!!! note
    [Thunk](https://github.com/gaearon/redux-thunk) middleware is included by default.

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

!!! note
    The [Redux Form](https://redux-form.com/7.1.0/) reducer is included by default.

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

## Dispatch
Components which have been [connected to the SDK](/pages/props/#connecting-your-components) will have the redux [dispatch](http://redux.js.org/docs/api/Store.html#dispatch) function passed to their props.

```jsx
import React from 'react';
import { sdkConnect } from 'deskpro-sdk-react';
import { Container } from 'deskpro-components';
import { Form, Input, Button } from 'deskpro-components/lib/bindings/redux-form';

class PageSettings extends React.Component {
  /**
   * Dispatches the APP_SETTINGS_CHANGED action after the form has
   * been submitted.
   */
  handleSubmit = (settings) => {
    this.props.dispatch({
        type: 'APP_SETTINGS_CHANGED',
        settings
    });
  };

  /**
   * @returns {XML}
   */
  render() {
    return (
      <Container>
        <Form name="settings" onSubmit={this.handleSubmit}>
          <Input
            label="Client ID"
            id="clientId"
            name="clientId"
          />
          <Button>
            Save
          </Button>
        </Form>
      </Container>
    );
  }
}

export default sdkConnect(PageSettings);
```

## Debugging
The SDK automatically enables support for the [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension) when running in the "development" environment. The extension allows developers to view, modify, and playback the redux state. It runs in Chrome, Firefox, and other browsers.

![screenshot](https://cloud.githubusercontent.com/assets/7957859/18002950/aacb82fc-6b93-11e6-9ae9-609862c18302.png)
