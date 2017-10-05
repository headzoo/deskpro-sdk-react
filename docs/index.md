# Overview
This page will help you install and build your first DeskproApps app using the React SDK.

## Getting Started

### Create the manifest
A manifest containing your app details must exist in the project root directory. The manifest details may be placed in the project _package.json_ file **or** a separate _manifest.json_ file.

_package.json_

```json
{
  "name": "my-app",
  "version": "0.1.0",
  "deskpro": {
    "version": "2.1.0",
    "title": "My App",
    "isSingle": true,
    "scope": "agent",
    "state": [
      {
        "name": "settings",
        "isBackendOnly": false,
        "permRead": "OWNER",
        "permWrite": "OWNER"
      }
    ],
    "targets": [
      {
        "target": "ticket-sidebar",
        "url": "html/index.html"
      }
    ]
  }
}
```

_manifest.json_

```json
{
  "version": "2.1.0",
  "title": "My App",
  "isSingle": true,
  "scope": "agent",
  "state": [
    {
      "name": "settings",
      "isBackendOnly": false,
      "permRead": "OWNER",
      "permWrite": "OWNER"
    }
  ],
  "targets": [
    {
      "target": "ticket-sidebar",
      "url": "html/index.html"
    }
  ]
}
```

### Create the component

_App.jsx_

```jsx
import React from 'react';

class App extends React.Component {
  /**
   * @returns {XML}
   */
  render() {
    return (
      <div>
        Hello, World!
      </div>
    );
  }
}

export default App;
```

### Create the entry point

_index.js_

```jsx
import ReactDOM from 'react-dom';
import { DeskproSDK, configureStore } from 'deskpro-sdk-react';
import App from './App';

export function runApp(dpapp) {
  const store = configureStore(dpapp);

  ReactDOM.render(
    <DeskproSDK dpapp={dpapp} store={store}>
      <App />
    </DeskproSDK>,
    document.getElementById('deskpro-app')
  );
}

```

### Run the app

`npm run dev`
