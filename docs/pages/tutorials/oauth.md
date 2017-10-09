Overview
========
This tutorial will walk you through creating a DeskPRO app which uses oauth to authenticate with a remote service provider. This tutorial will use [GitHub](https://github.com/) as an example.

### OAuth review
Before starting the tutorial let's go over designing DeskPRO apps to use the oauth work flow.

#### Settings
DeskPRO admins must configure the app for oauth on the first run. Configuration is handled by showing the admin a form which has a "Authorization callback URL" value and inputs to enter a client ID and client secret.
![screenshot](/images/tutorials/oauth-1.png)

#### Registration
The admin is instructed to visit their [GitHub account settings](https://github.com/settings/developers) in order to register the app. The admin will provide the "Authorization callback URL" to the registration form.
![screenshot](/images/tutorials/oauth-5.png)

#### Credentials
On the next page the admin will be given a client ID and client secret.
![screenshot](/images/tutorials/oauth-6.png)

The admin comes back to the app settings form where they enter and save the client ID and client secret. This concludes configuring the app for oauth, and the admin may close the window.
![screenshot](/images/tutorials/oauth-7.png)

#### Authorization
Now when an agent opens the app they will be prompted to authenticate with GitHub.
![screenshot](/images/tutorials/oauth-4.png)

#### Success
Upon successful authentication the agent will be shown the index page.
![screenshot](/images/tutorials/oauth-2.png)

----

To follow this tutorial you will need:

* A [GitHub](https://github.com/) account
* [DeskPRO running on your computer](https://github.com/deskpro/deskpro/blob/develop/README.md)
* NPM 6 or greater
* Git 1.9 or greater
* A IDE or text editor

----

### Step 1. Clone the boilerplate
The SDK boilerplate includes the basic app configuration and files to help developers get started writing apps.

```
git clone https://github.com/deskpro/deskproapps-boilerplate-react oauth-tutorial
cd oauth-tutorial
npm install
```

### Step 2. Configure the manifest
Edit the app configuration in _package.json_, which can be found in the app root directory. Change the "title" property to "OAuth Tutorial". Also add the "storage" values shown below.

```json
"deskpro": {
  "version": "2.1.0",
  "title": "OAuth Tutorial",
  "isSingle": true,
  "scope": "agent",
  "storage": [
    {
      "name": "oauth:github",
      "isBackendOnly": true,
      "permRead": "EVERYBODY",
      "permWrite": "OWNER"
    },
    {
      "name": "settings",
      "isBackendOnly": false,
      "permRead": "EVERYBODY",
      "permWrite": "OWNER"
    },
    {
      "name": "user_settings",
      "isBackendOnly": false,
      "permRead": "OWNER",
      "permWrite": "OWNER"
    }
  ]
}
```

**Explanation**  
@todo

### Step 3. Create a settings page
Create a new component with a form at _src/main/javascript/PageSettings.jsx_.

```jsx
// PageSettings.jsx

import React from 'react';
import { sdkConnect } from 'deskpro-sdk-react';
import { Form, Input, Button } from 'deskpro-components/lib/bindings/redux-form';

class PageSettings extends React.PureComponent {
  /**
   * Called when the form is submitted
   */
  handleSubmit = (settings) => {
    const { oauth, route } = this.props;
    
    // Create a "connection" object using the submitted values, plus
    // the values for urlAccessToken and urlAuthorize. Then register
    // the connection with the oauth module and redirect to the
    // index page.
    const connection = Object.assign({}, settings, {
      urlAccessToken: 'https://github.com/login/oauth/access_token',
      urlAuthorize:   'https://github.com/login/oauth/authorize'
    });
    oauth.register('github', connection);
    route.to('index');
  };
  
  /**
   * @returns {XML}
   */
  render() {
    const { oauth, storage } = this.props;

    return (
      <Form
        name="settings"
        initialValues={storage.app.settings}
        onSubmit={storage.onSubmitApp(this.handleSubmit)}
        >
        <p>
          You must register this app with GitHub before using it.
          Fill out the app registration form and when you come to
          the "Authorization callback URL" field enter the following
          value:
        </p>
        <code>
          {oauth.providers.github.urlRedirect}
        </code>
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
    );
  }
}

export default sdkConnect(PageSettings);
```

![screenshot](/images/tutorials/oauth-1.png)

**Explanation**  
@todo

### Step 4. Create an index page
Create a new component to display the oauth access token at _src/main/javascript/PageIndex.jsx_.

```jsx
// PageIndex.jsx

import React from 'react';
import { sdkConnect } from 'deskpro-sdk-react';

class PageIndex extends React.Component {
  /**
   * @returns {XML}
   */
  render() {
    const { storage } = this.props;
    
    return (
      <div>
        <p>
          {storage.app.user_settings ? (
            <p>
              Thanks for authenticating!
              Your access token is:
              {storage.app.user_settings.accessToken}
            </p>
          ) : (
            <p>
              Oop! Looks like authentication failed!
            </p>
          )}
        </p>
      </div>
    );
  }
}

export default sdkConnect(PageIndex);
```

![screenshot](/images/tutorials/oauth-2.png)
![screenshot](/images/tutorials/oauth-3.png)

**Explanation**  
@todo

### Step 5. Modify the app component
Edit the app component at _src/main/javascript/App.jsx_ to look like the following code.

```jsx
// App.jsx

import React from 'react';
import PageSettings from './PageSettings';
import PageIndex from './PageIndex';

export default class App extends React.Component {
  /**
   * Invoked immediately after a component is mounted
   */
  componentDidMount() {
    const { oauth, storage, route, ui } = this.props;

    // The app settings will be empty the first time the app is run.
    // Route to the settings page so the admin can setup oauth creds.
    if (!storage.app.settings) {
      return route.to('settings');
    }

    // Route to the index page if the user already has an access token.
    if (storage.app.user_settings.accessToken) {
      return route.to('index');
    }

    // Otherwise obtain the access token using oauth.
    oauth.access('github')
      // Save the access token and redirect to the index page.
      .then((resp) => {
        const user_settings = {
            accessToken: resp.accessToken
        };
        storage.setApp({ user_settings });
        return route.to('index');
      })
      // Send any errors directly to the UI to be displayed.
      .catch(ui.error);
  }
  
  /**
   * @returns {XML}
   */
  render() {
    return (
      <Routes>
        <Route location="settings" component={PageSettings} />
        <Route location="index" component={PageIndex} />
      </Routes>
    );
  }
}
```

![screenshot](/images/tutorials/oauth-4.png)

**Explanation**  
@todo

### Step 6. Run the dev server
Make sure DeskPRO is running on your computer, and then from the app root directory run the following command.

```
npm run dev
```

The `dev` script builds your app and starts a development server which communicates with DeskPRO to install the app. Open [https://localhost/agent/?appstore.environment=development](https://deskpro-dev/agent/?appstore.environment=development) when the the `dev` command finishes building to view the finished app.
