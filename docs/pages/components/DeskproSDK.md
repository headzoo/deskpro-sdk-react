Overview
========
The `DeskproSDK` component wraps the app main component. It bootstraps the app and [connects it to the SDK](/pages/props/#connecting-your-components).

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

## Props

```jsx
<DeskproSDK
    dpapp={object}
    store={object}
/>
```
