Overview
========
This tutorial will walk you through creating a DeskPRO app which has two pages. One for app settings and a page which displays the settings.

### Step 1. Clone the boilerplate

```
git clone https://github.com/deskpro/deskproapps-boilerplate-react participants
cd participants
npm install
```

### Step 2. Update the manifest
Update the "deskpro" property in the _package.json_, which you can find in your project root. Change the "title" property to "Settings Form".

```json
{
  "deskpro": {
    "version": "2.1.0",
    "title": "Settings Form",
    "isSingle": true,
    "scope": "agent",
    "targets": [
      {
        "target": "ticket-sidebar",
        "url": "html/index.html"
      }
    ]
  }
}
```

### Step 3. Create the settings page
Create a new source code file and save it at _src/main/javascript/PageSettings.jsx_. The settings page uses form components from the [deskpro-components](https://github.com/deskpro/deskpro-components) library, which is included in the boilerplate by default.

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
  handleSubmit = (settings) => {
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
            label="Your first name"
            id="first_name"
            name="first_name"
          />
          <Input
            label="Your last name"
            id="last_name"
            name="last_name"
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

The form uses the [this.props.storage.onSubmitApp](/pages/props/#storage) form handler. the handler writes the form values to app storage using the form `name` prop as the storage key when the form is submitted, and then calls the `this.handleSubmit` function. That function changes to the index page.

### Step 4. Create the index page
Create a new source code file and save it at _src/main/javascript/PageIndex.jsx_. This page will display the values entered on the settings page.

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
        <ul>
            <li>First name: {settings.first_name}</li>
            <li>Last name: {settings.last_name}</li>
        </ul>
        <LinkButton to="settings">
            Edit
        </LinkButton>
      </Container>
    );
  }
}

export default sdkConnect(PageSettings);
```

The storage values saved by the settings form are read from the `this.props.storage.app.settings` object, which updates when the values change.

### Step 5. Modify the app component
Open the main app component at _src/main/javascript/App.jsx_. The [Routes and Route components](/pages/components/Routes/) are used to display either the index or settings page.

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

### Step 6. Run the dev server
Start the dev server.

```
npm run dev
```

Now open your browser to [https://localhost/agent/?appstore.environment=development](https://deskpro-dev/agent/?appstore.environment=development).
