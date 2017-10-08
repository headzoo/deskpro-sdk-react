Overview
========
This tutorial will walk you through creating a DeskPRO app which has two pages. One page with a settings form and one page which displays the form values. [App storage](/pages/props/#storage) will be used to save the values, and the [route object](/pages/props/#route) will be used to switch between the two pages.

![screenshot](/images/tutorials/form-1.png)

![screenshot](/images/tutorials/form-2.png)

### Step 1. Clone the boilerplate
The SDK boilerplate includes the basic app configuration and files to help developers get started writing apps.

```
git clone https://github.com/deskpro/deskproapps-boilerplate-react form-tutorial
cd form-tutorial
npm install
```

### Step 2. Update the manifest
Edit the app configuration in _package.json_, which can be found in the app root directory. Change the "title" property to "Form Tutorial". This value will be shown in the app toolbar.

```json
{
  "deskpro": {
    "version": "2.1.0",
    "title": "Form Tutorial",
    "isSingle": true,
    "scope": "agent",
    "targets": [
      {
        "target": "ticket-sidebar",
        "url": "html/index.html"
      }
    ],
    "storage": [
      {
        "name": "settings",
        "isBackendOnly": false,
        "permRead": "EVERYBODY",
        "permWrite": "EVERYBODY"
      }
    ]
  }
}
```

!!! tip
    The [manifest documentation](/pages/manifest) contains more information on app configuration.

### Step 3. Create the settings page
Create a new Javascript file and save it at _src/main/javascript/PageSettings.jsx_. The settings page uses form components from the [deskpro-components](https://github.com/deskpro/deskpro-components) library, which is included in the boilerplate by default.

```jsx
import React from 'react';
import { sdkConnect } from 'deskpro-sdk-react';
import { Container } from 'deskpro-components';
import { Form, Input, Button } from 'deskpro-components/lib/bindings/redux-form';

class PageSettings extends React.Component {
  /**
   * Changes to the index page after the form is submitted and
   * the values have been written to app storage.
   */
  handleSubmit = () => {
    this.props.route.to('index');
  };

  /**
   * @returns {XML}
   */
  render() {
    const { storage } = this.props;
    const initialValues = storage.app.settings || {};
    
    return (
      <Container>
        <Form
          name="settings"
          initialValues={initialValues}
          onSubmit={storage.onSubmitApp(this.handleSubmit)}
        >
          <Input
            label="Client ID"
            id="clientId"
            name="clientId"
          />
          <Input
            label="Client Secret"
            id="clientSecret"
            name="clientSecret"
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

The form uses [this.props.storage.onSubmitApp](/pages/props/#storage) as the `onSubmit` handler, which writes the form values to app storage using the form `name` prop as the storage key. In this case the form values are saved using the "settings" key.

The submit handler then calls `this.handleSubmit`, which uses the [route object](/pages/props/#route) to switch to the index page.

!!! note
    Passing `this.handleSubmit` to `this.props.storage.onSubmitApp` is optional. In the above code `this.handleSubmit` is only used to redirect to a different page after the form is submitted. Otherwise it could have been omitted and the `onSubmit` prop could have been written like this:
    
    `onSubmit={storage.onSubmitApp}`

### Step 4. Create the index page
Create a new Javascript file and save it at _src/main/javascript/PageIndex.jsx_. This page will display the values entered on the settings page.

```jsx
import React from 'react';
import { LinkButton, sdkConnect } from 'deskpro-sdk-react';
import { Container } from 'deskpro-components';

class PageIndex extends React.Component {
  /**
   * @returns {XML}
   */
  render() {
    const { storage } = this.props;
    const settings = storage.app.settings;
    
    return (
      <Container>
        <div>
          <div>
            Client ID: {settings.clientId}
          </div>
          <div>
            Client Secret: {settings.clientSecret}
          </div>
        </div>
        <LinkButton to="settings">
          Edit
        </LinkButton>
      </Container>
    );
  }
}

export default sdkConnect(PageIndex);
```

The storage values saved by the settings form are read from `this.props.storage.app.settings`, which has been updated automatically when the values were written to storage.

### Step 5. Modify the app component
Open the main app component at _src/main/javascript/App.jsx_. The [Routes and Route components](/pages/components/Routes/) will be used to display either the index or settings page. Depending on the current location.

```jsx
import React from 'react';
import { Routes, Route } from 'deskpro-sdk-react';
import { Container } from 'deskpro-components';
import PageSettings from './PageSettings';
import PageIndex from './PageIndex';

const App = () => (
  <Container>
    <Routes>
        <Route location="index" component={PageIndex} />
        <Route location="settings" component={PageSettings} />
    </Routes>
  </Container>
);

export default App;
```

!!! note
    The `App` component does not need to be connected to the SDK with `sdkConnect`, because it will be wrapped by the `DeskproSDK` component.

### Step 6. Run the dev server
Make sure DeskPRO is running on your computer. From the app root directory run the following command.

```
npm run dev
```

The `dev` script builds your app and starts a development server which communicates with DeskPRO to install the app. When the dev server is finished building the app you can open your browser to [https://localhost/agent/?appstore.environment=development](https://deskpro-dev/agent/?appstore.environment=development).
