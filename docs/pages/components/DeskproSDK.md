Overview
========
The `DeskproSDK` component bootstraps the app and [connects it to the SDK](/pages/props/#connecting-your-components).

```jsx
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

The app component may also be passed to `DeskproSDK` via the `component` prop.

```jsx
import ReactDOM from 'react-dom';
import { DeskproSDK, configureStore } from 'deskpro-sdk-react';

const store = configureStore(dpapp);

export function runApp(dpapp) {
  ReactDOM.render(
    <DeskproSDK dpapp={dpapp} store={store} component={App} />,
    document.getElementById('deskpro-app')
  );
}

```

## Props

```jsx
<DeskproSDK
    dpapp={object}
    store={object}
    component={element}
/>
```
