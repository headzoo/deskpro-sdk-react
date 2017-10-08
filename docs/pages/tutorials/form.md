Overview
========
This tutorial will walk you through creating a DeskPRO app which has two pages. One page with a settings form and one page which displays the form values. [App storage](/pages/props/#storage) will be used to save the values, and the [route object](/pages/props/#route) will be used to switch between the two pages.

![screenshot](/images/tutorials/form-1.png)

![screenshot](/images/tutorials/form-2.png)

----

To follow this tutorial you will need:

* [DeskPRO running on your computer](https://github.com/deskpro/deskpro/blob/develop/README.md)
* NPM 6 or greater
* Git 1.9 or greater
* A IDE or text editor

----

### Step 1. Clone the boilerplate
The SDK boilerplate includes the basic app configuration and files to help developers get started writing apps.

```
git clone https://github.com/deskpro/deskproapps-boilerplate-react form-tutorial
cd form-tutorial
npm install
```

### Step 2. Update the manifest
Edit the app configuration in _package.json_, which can be found in the app root directory. Change the "title" property to "Form Tutorial".

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

**Explanation**  

*  The "title" value will be shown in the app toolbar. See the [manifest documentation](/pages/manifest) for more information.

### Step 3. Create the settings page
Create a new component with a form at _src/main/javascript/PageForm.jsx_.

```jsx
// PageForm.jsx

import React from 'react';
import { sdkConnect } from 'deskpro-sdk-react';
import { Container } from 'deskpro-components';
import { Form, Input, Button } from 'deskpro-components/lib/bindings/redux-form';

class PageForm extends React.Component {
  /**
   * Changes to the index page after the form is submitted and
   * the values have been written to app storage.
   *
   * @param {object} formValues
   */
  handleSubmit = (formValues) => {
    this.props.route.to('index');
  };

  /**
   * @returns {XML}
   */
  render() {
    const { storage } = this.props;
    const initialValues = (storage.app.settings || {});
    
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

export default sdkConnect(PageForm);
```

**Explanation**

*  The form uses components from the [deskpro-components](https://github.com/deskpro/deskpro-components) library, which is included in the boilerplate by default.

* The [this.props.storage.onSubmitApp](/pages/props/#storage) function is passed to the form `onSubmit` handler to automatically save the submitted form values to app storage. The function saves the form values to the DeskPRO database using the form `name` prop ("settings") as the storage key. See the [storage documentation](/pages/props/#storage) for more information.

* The `this.handleSubmit` function is then called by `this.props.storage.onSubmitApp` with the form values. The function switches to the index page using the SDK router. See the [route documentation](/pages/props/#route) for more information.

* The form is initialized with the existing settings by passing `this.props.storage.app.settings` to the `initialValues` prop. This works because values written to app storage using the key "settings" can be read from storage via the prop `this.storage.app.settings`.

* The `PageForm` component is connected to the SDK using the `sdkConnect` function. Which is required in order to read and write to storage. See the documentation on [connecting components to the SDK](/pages/props/#connecting-your-components) for more information.

!!! note
    The code uses `(storage.app.settings || {})` to assign a default value because the settings will not exist the first time you run the app.

!!! note
    The callback passed to `this.props.storage.onSubmitApp` is optional and may be omitted. Simply pass the function to the submit handler using `onSubmit={this.props.storage.onSubmitApp}` when post-processing of the form values is not required.


### Step 4. Create the index page
Create a new component to display the form values at _src/main/javascript/PageIndex.jsx_.

```jsx
// PageIndex.jsx

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
        <LinkButton to="form">
          Edit
        </LinkButton>
      </Container>
    );
  }
}

export default sdkConnect(PageIndex);
```

**Explanation**

* The settings were saved to app storage using the key "settings" which means they can be read from storage from `this.props.storage.app.settings`. See the [storage documentation](/pages/props/#storage) for more information.

* The `LinkButton` component uses the SDK router to switch to the "form" page when clicked. See the [route documentation](/pages/props/#route) for more information.

* The `PageIndex` component is connected to the SDK using the `sdkConnect` function. Which is required in order to read and write to storage. See the documentation on [connecting components to the SDK](/pages/props/#connecting-your-components) for more information.

### Step 5. Modify the app component
Edit the app component at _src/main/javascript/App.jsx_ to look like the following code.
```jsx
// App.jsx

import React from 'react';
import { Routes, Route } from 'deskpro-sdk-react';
import { Container } from 'deskpro-components';
import PageForm from './PageForm';
import PageIndex from './PageIndex';

const App = () => (
  <Container>
    <Routes>
        <Route location="index" component={PageIndex} />
        <Route location="form" component={PageForm} />
    </Routes>
  </Container>
);

export default App;
```

**Explanation**

* The `Routes` components reads the `this.props.route.location` value to render the `Route` with the matching `location` prop. See the [Routes component documentation](/pages/components/Routes/) for more information.

!!! note
    The `App` component is connected to the SDK automatically by the boilerplate, and does _not_ need to be wrapped with `sdkConnect`.

### Step 6. Run the dev server
Make sure DeskPRO is running on your computer, and then from the app root directory run the following command.

```
npm run dev
```

The `dev` script builds your app and starts a development server which communicates with DeskPRO to install the app. Open [https://localhost/agent/?appstore.environment=development](https://deskpro-dev/agent/?appstore.environment=development) when the the `dev` command finishes building to view the finished app.
