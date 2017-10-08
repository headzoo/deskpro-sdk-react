Overview
========
This tutorial will walk you through creating a simple DeskPRO app which displays a list of people participating in a ticket.

![screenshot](/images/tutorials/basic-1.png)

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
git clone https://github.com/deskpro/deskproapps-boilerplate-react basic-tutorial
cd basic-tutorial
npm install
```

### Step 2. Update the manifest
Edit the app configuration in _package.json_, which can be found in the app root directory. Change the "title" property to "Participants". This value will be shown in the app toolbar.

```json
{
  "deskpro": {
    "version": "2.1.0",
    "title": "Participants",
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

!!! tip
    The [manifest documentation](/pages/manifest) contains more information on app configuration.

### Step 3. Modify the app component
Edit the app component at _src/main/javascript/App.jsx_ to look like the following code.

```jsx
// App.jsx

import React from 'react';
import { Container, Avatar } from 'deskpro-components';

export default class App extends React.Component {
  render() {
    const { tabData } = this.props;
    
    return (
      <Container>
        <ul className="participants-list">
          {tabData.participants.map((p) => (
            <li key={p.person.id}>
              <Avatar src={p.person.default_picture_url} />
              <div>
                {p.person.name}
              </div>
              <div>
                {p.person.primary_email.email}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    );
  }
}
```

The SDK automatically injects the [tabData](/pages/props/#tabdata) prop into the component. This prop is a plain object which contains information about the open ticket. The code above iterates over the `tabData.participants` array and displays an avatar for each person.

### Step 4. Modify the app styles
The boilerplate includes a SASS stylesheet which can be found in _src/main/sass/index.scss_. Modify the stylesheet to look like the following.

```sass
$dp-styles-font-path: "~deskpro-components/src/styles/fonts/";
@import "~deskpro-components/src/styles/main.scss";

.participants-list {
  list-style-type: none;
  
  li {
    margin-bottom: 1rem;
  }
}
```

### Step 5. Run the dev server
Make sure DeskPRO is running on your computer. From the app root directory run the following command to start the dev server.

```
npm run dev
```

The `dev` script builds your app and starts a development server which communicates with DeskPRO to install the app. When the dev server is finished building the app you can open your browser to [https://localhost/agent/?appstore.environment=development](https://deskpro-dev/agent/?appstore.environment=development).
