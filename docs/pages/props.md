Overview
========
The SDK automatically passes a number of objects to your components via props. Some of the SDK props contain information about the running application and current context, and some provide methods to interact with DeskPRO. For instance the [storage](#storage) prop which allows developers to persist values with the DeskPRO application, and the [me](#me) prop which contains information about the person using the app.

## Connecting your components
Components which need access to the SDK props must be _connected_ to the SDK. The [DeskproSDK component](/pages/components/DeskproSDK/) automatically connects the wrapped component.

The `<App />` component in the following example will have all SDK props passed to it because it's wrapped by the `DeskproSDK` component.

```jsx
ReactDOM.render(
    <DeskproSDK dpapp={dpapp} store={store}>
      <App />
    </DeskproSDK>,
    document.getElementById('deskpro-app')
);
```

Only the app root component gets wrapped by `DeskproSDK`. The other components in your app will use the `sdkConnect` function to connect them to the SDK props. Its usage is optional, and is only required when a component needs access to the props.

```jsx
import React from 'react';
import { sdkConnect } from 'deskpro-react-sdk';

class PageSettings extends React.Component {
    render() {
        return (
            <div>
                {this.props.storage.app.country}
            </div>
        );
    }
}

export default sdkConnect(PageSettings);
```

The function may be used as a decorator when [decorators are enabled](https://babeljs.io/docs/plugins/transform-decorators/).

```jsx
import React from 'react';
import { sdkConnect } from 'deskpro-react-sdk';

@sdkConnect
export default class PageSettings extends React.Component {
    render() {
        return (
            <div>
                {this.props.storage.app.country}
            </div>
        );
    }
}
```

**Advanced usage**  
React SDK uses [Redux](http://redux.js.org/) internally to manage state. The same `mapStateToProps` and `mapDispatchToProps` functions [supported by React Redux](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) may also be passed to the `sdkConnect` function.

```js
import React from 'react';
import { sdkConnect } from 'deskpro-react-sdk';

class PageSettings extends React.Component {
    render() {
        return (
            <div>
                {this.props.country}
            </div>
        );
    }
}

const mapStateToProps(state) {
    return {
        country: state.sdk.storage.app.settings.country
    };
};

export default sdkConnect(PageSettings, mapStateToProps);
```

-----

## Storage
`this.props.storage`

An object which reads and writes values to the DeskPRO database in order to persist them from one invocation of the app and another. Two mechanisms are provided for storing values. One for storing global "app" values, and one for attaching "entity" values to the currently opened ticket.

!!! note
    See the [manifest storage configuration](/pages/manifest/#storage) for more information about declaring storage values and setting permissions.

Call `this.props.storage.setApp()` to persist global values which will be bound the app. For instance app settings or user information. The method takes an object of key/value pairs.

```js
this.props.storage.setApp({ country: 'uk' });
```

Once the values have been saved the SDK will pass new props to the connected components with the new values. The app values can then be read from the `this.props.storage.app` object.

```js
const country = this.props.storage.app.country;
```

The following example renders a form with a list of countries. The component uses `this.props.storage` to save the selected value.

```jsx
import React from 'react';
import { sdkConnect } from 'deskpro-sdk-react';
import { Form, Select, Button } from 'deskpro-components/lib/bindings/redux-form';

class PageCountry extends React.Component {
    /**
     * Receives the submitted form values and saves them to
     * app storage
     */
    handleSubmit = (values) => {
        this.props.storage.setApp({ country: values.country });
    };
    
    /**
     * @returns {XML}
     */
    render() {
        const initialValues = {
            country: this.props.storage.app.country
        };
        const options = [
            { label: 'United Kingdom', value: 'uk' },
            { label: 'United States', value: 'us' }
        ];

        return (
            <Form onSubmit={this.handleSubmit} initialValues={initialValues}>
                <Select
                    label="Country"
                    id="country"
                    name="country"
                    options={options}
                />
                <Button>Submit</Button>
            </Form>
        );
    }
}

export default sdkConnect(PageCountry);
```

Call `this.props.storage.setEntity()` to attach values to the currently opened ticket. Unlike the global app values, entity values are unique to each ticket. The method takes an object of key/value pairs.

```js
this.props.storage.setEntity({ note: '...' });
```

!!! note
    Under the hood the SDK saves the value using key "note:{ticket_id}". Which means the value of "note" is unique to the ticket being viewed.

Once the values have been saved they can be read from the `this.props.storage.entity` object.

```js
const note = this.props.storage.entity.note;
```

The following example allows agents to attach notes to the opened ticket. It shows the current notes with a form to create a new note.

```jsx
import React from 'react';
import { sdkConnect } from 'deskpro-sdk-react';
import { Form, Textarea, Button } from 'deskpro-components/lib/bindings/redux-form';

class Notes extends React.Component {
    /**
     * Receives the submitted form values and saves them to
     * app storage
     */
    handleSubmit = (values) => {
        const { storage } = this.props;
        const notes = storage.entity.notes;
        
        // Clone the existing notes or create a new array if the ticket
        // doesn't have any existing notes.
        const newNotes = (notes || []).slice(0);
        newNotes.push(values.note);
        
        // Attach the notes to the open ticket. This will overwrite the
        // existing value.
        storage.setEntity({ notes: newNotes });
    };
    
    /**
     * @returns {XML}
     */
    render() {
        const { storage } = this.props;
        const notes = storage.entity.notes;

        return (
            <div>
                <h1>Notes</h1>
                <ul>
                    {notes.map((note) => (
                        <li>{note}</li>
                    ))}
                </ul>
                
                <Form onSubmit={this.handleSubmit}>
                    <Textarea
                        label="Add note"
                        id="note"
                        name="note"
                    />
                    <Button>Submit</Button>
                </Form>
            
            </div>
        );
    }
}

export default sdkConnect(Notes);
```

The SDK can automatically save form values to app/entity storage with `this.props.storage.onSubmitApp` and `this.props.storage.onSubmitEntity`. Use them as the form `onSubmit` handler, and the form values will be written to storage using the name of the form as the storage key.

The following example uses `this.props.storage.onSubmitApp` to automatically save the form values to app storage. The values will be saved using the key "settings".

```jsx
import React from 'react';
import { sdkConnect } from 'deskpro-sdk-react';
import { Form, Input, Button } from 'deskpro-components/lib/bindings/redux-form';

class PageSettings extends React.Component {
  render() {
    const { storage } = this.props;
    const settings = storage.app.settings || {};
    
    /**
     * @returns {XML}
     */
    return (
        <div>
            <div>Client ID: {settings.clientId}</div>
            <Form name="settings" onSubmit={storage.onSubmitApp}>
              <Input
                id="clientId"
                name="clientId"
              />
            </Form>
            <Button>Submit</Button>
        </div>
    );
}
```

An optional callback may be passed to the submit handlers which is called after the form values have been successfully written to storage.

```jsx
class PageSettings extends React.Component {
    /**
     * Called after the values have been saved to storage
     */
    handleSubmit = (values) => {
        console.log(values);
        this.props.route.to('index');
    };
    
    /**
     * @returns {XML}
     */
    render() {
        const { storage } = this.props;
        
        return (
            <Form
              name="settings"
              onSubmit={storage.onSubmitApp(this.handleSubmit)}
            >
              <Input
                id="clientId"
                name="clientId"
              />
            </Form>
        );
    }
}
```

-----

## Route
`this.props.route`

A light-weight router which is used to display different "pages" within an app. Pages within apps do not have URLs like web pages, but they can be given simple labels like "settings" or "index", and `this.props.route` can then be used to switch between them.

The following example uses a `switch` statement to display a different page depending on the current location.

```js
import React from 'react';
import { sdkConnect } from 'deskpro-sdk-react';
import PageAccount from './PageAccount';
import PageIndex from './PageIndex';

class Content extends React.Component {
    render() {
        const { route } = this.props;
        
        switch (route.location) {
          case 'account':
            return <PageAccount />;
          case 'index':
            return <PageIndex />;
        }
    }
}

export default sdkConnect(Content);
```

The object contains two properties:

* `this.props.route.location` - A string with the name of the current page
* `this.props.route.params` - An object of key/value pairs associated with the location

The [Routes](/pages/components/Routes) and [Route](/pages/components/Routes) components may be used in place of a `switch` statement.

```jsx
// App.jsx
import React from 'react';
import { Routes, Route, sdkConnect } from 'deskpro-sdk-react';
import PageAccount from './PageAccount';
import PageIndex from './PageIndex';

class App extends React.Component {
  render() {
    return (
      <Routes>
        <Route location="account" component={PageAccount} />
        <Route location="index" component={PageIndex} />
      </Routes>
    );
  }
}

export default sdkConnect(App);
```

The location is changed by calling `this.props.route.to()` with the name of a page.

```js
this.props.route.to('index');
```

Params may also be passed along with the location.

```js
this.props.route.to('account', { id: 5 });
```

The following example renders two pages. An "index" page with a form where a note may be entered, and a "note" page which displays the note.

```jsx
// PageIndex.jsx
import React from 'react';
import { sdkConnect } from 'deskpro-sdk-react';
import { Form, Input, Button } from 'deskpro-components/lib/bindings/redux-form';

class PageIndex extends React.Component {
    /**
     * Switches to the "note" page, passing the note value along with
     * the location.
     */
    handleSubmit = (values) => {
        this.props.route.to('note', { note: values.note });
    };
    
    /**
     * @returns {XML}
     */
    render() {
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Input
                        label="Note:"
                        id="note"
                        name="note"
                    />
                    <Button>Submit</Button>
                </Form>
            </div>
        );
    }
}

export default sdkConnect(PageIndex);
```

```jsx
// PageNote.jsx
import React from 'react';
import { sdkConnect } from 'deskpro-sdk-react';

class PageNote extends React.Component {
    /**
     * Changes to the index page when the button is clicked.
     */
    handleClick = () => {
        this.props.route.to('index');
    };
    
    /**
     * @returns {XML}
     */
    render() {
        const { route } = this.props;
        
        return (
            <div>
                <p>{route.params.note}</p>
                <button onClick={this.handleClick}>
                    To index page
                </button>
            </div>
        );
    }
}

export default sdkConnect(PageNote);
```

The `Routes` and `Route` components are used to switch between the two pages.

```jsx
// App.jsx
import React from 'react';
import { Routes, Route } from 'deskpro-sdk-react';
import PageNote from './PageNote';
import PageIndex from './PageIndex';

const App = () => (
  <Routes>
    <Route location="note" component={PageNote} />
    <Route location="index" component={PageIndex} />
  </Routes>
);
```

Connected components may also change the location using the [Link](/pages/components/Link) and [LinkButton](/pages/components/LinkButton) components.

```js
import React from 'react';
import { sdkConnect, Link, LinkButton } from 'deskpro-sdk-react';

class Menu extends React.Component {
    render() {
        return (
            <nav>
                <ul>
                    <li>
                        <Link to="settings">
                            Settings
                        </Link>
                    </li>
                    <li>
                        <Link to="account" params={{ id: 5 }}>
                            Account
                        </Link>
                    </li>
                </ul>
                <LinkButton to="index">
                    Home
                </LinkButton>
            </nav>
        );
    }
}

export default sdkConnect(Menu);
```

-----

## OAuth
`this.props.oauth`

An object which authenticates with remote services and stores oauth credentials.

Save oauth connection settings.

```js
const connection = {
  urlAccessToken: OAUTH_ACCESS_URI,
  urlAuthorize:   OAUTH_AUTH_URI,
  clientId:       '...',
  clientSecret:   '...'
};

this.props.oauth.register('provider_name', connection);
```

Authenticate with the oauth provider and save the access token.

```js
this.props.oauth.access('provider_name')
  .then(({ accessToken }) => {
    this.props.storage.setApp({ user_settings: { accessToken } });
  });
```

Read the app oauth provider settings.

```js
const provider_settings = this.props.oauth.providers.provider_name;
```

-----

## TabData
`this.props.tabData`

An object which is populated with the details of the currently opened ticket.

```js
import React from 'react';
import { sdkConnect } from 'deskpro-sdk-react';

class TicketInfo extends React.Component {
    render() {
        const { tabData } = this.props;
        
        return (
            <ul>
                <li>ID: {tabData.id}</li>
                <li>Created: {tabData.date_created}</li>
                <li>Subject: {tabData.subject}</li>
            </ul>
        );
    }
}

export default sdkConnect(Menu);
```

The object contains the following properties:

```js
{
    id:                             number,
    is_hold:                        bool,
    access_code:                    string,
    access_code_email_body_token:   string,
    access_code_email_header_token: string,
    agent:                          object,
    attachments:                    array,
    auth:                           string,
    category:                       object,
    count_agent_replies:            number,
    count_user_replies:             number,
    current_user_waiting:           number,
    current_user_waiting_work:      number,
    custom_data:                    array,
    date_agent_waiting:             string,
    date_agent_waiting_ts:          number,
    date_agent_waiting_ts_ms:       number,
    date_archived:                  string,
    date_archived_ts:               number,
    date_archived_ts_ms:            number,
    date_created:                   string,
    date_created_ts:                number,
    date_created_ts_ms:             number,
    date_feedback_rating_ts:        number,
    date_feedback_rating_ts_ms:     number,
    date_first_agent_assign:        string,
    date_first_agent_assign_ts:     number,
    date_first_agent_assign_ts_ms:  number,
    date_first_agent_reply:         string,
    date_first_agent_reply_ts:      number,
    date_first_agent_reply_ts_ms:   number,
    date_last_agent_reply:          string,
    date_last_agent_reply_ts:       number,
    date_last_agent_reply_ts_ms:    number,
    date_last_user_reply:           string,
    date_last_user_reply_ts:        number,
    date_last_user_reply_ts_ms:     number,
    date_locked:                    string,
    date_locked_ts:                 number,
    date_locked_ts_ms:              number,
    date_on_hold:                   string,
    date_on_hold_ts:                number,
    date_on_hold_ts_ms:             number,
    date_resolved:                  string,
    date_resolved_ts:               number,
    date_resolved_ts_ms:            number,
    date_status:                    string,
    date_status_ts:                 number,
    date_status_ts_ms:              number,
    date_user_waiting:              string,
    date_user_waiting_ts:           number,
    date_user_waiting_ts_ms:        number,
    department:                     object,
    has_attachments:                bool,
    hidden_status:                  string,
    labels:                         array,
    language:                       object,
    organization:                   object,
    original_subject:               string,
    parent_ticket:                  string,
    participants:                   array,
    person:                         object,
    person_email:                   object,
    priority:                       string,
    product:                        object,
    ref:                            string,
    sent_to_address:                string,
    status:                         string,
    subject:                        string,
    ticket_hash:                    string,
    ticket_slas:                    object,
    total_to_first_reply:           number,
    total_to_first_reply_work:      number,
    total_to_resolution:            number,
    total_to_resolution_work:       number,
    total_user_waiting:             number,
    total_user_waiting_real:        number,
    total_user_waiting_work:        number,
    urgency:                        number,
    waiting_times:                  array,
    workflow:                       object,
    worst_sla_status:               string
}
```

-----

## Me
`this.props.me`

An object which is populated with the details of the agent/admin using the app.

```js
import React from 'react';
import { sdkConnect } from 'deskpro-sdk-react';

class Page extends React.Component {
    render() {
        const { me } = this.props;
        
        return (
            <div>
                Welcome, {me.name}!
            </div>
        );
    }
}

export default sdkConnect(Menu);
```

The object contains the following properties:

```js
{
    id:              number,
    avatar:          object,
    can_admin:       bool,
    can_agent:       bool,
    can_billing:     bool,
    is_agent:        bool,
    is_confirmed:    bool,
    is_contact:      bool,
    is_deleted:      bool,
    is_disabled:     bool,
    is_user:         bool,
    was_agent:       bool,
    online:          bool,
    labels:          array,
    teams:           array,
    phone_numbers:   array,
    date_created:    string,
    date_last_login: string,
    name:            string,
    display_name:    string,
    first_name:      string,
    last_name:       string,
    primary_email:   object,
    emails:          array,
    gravatar_url:    string,
    tickets_count:   number,
    timezone:        string
}
```

-----

## UI
`this.props.ui`

An object containing methods which allow you to manipulate the UI.

Call `this.props.ui.setLoading(true)` to display the loading animation, and `this.props.ui.setLoading(false)` to turn it off.

![screenshot](/images/props-ui-2.png)

```jsx
import React from 'react';
import { sdkConnect } from 'deskpro-react-sdk';

class Hello extends React.Component {
    componentWillUpdate() {
        this.props.ui.setLoading(true);
    }
    
    componentDidUpdate() {
        this.props.ui.setLoading(false);
    }
    
    render() {
        return (
            <div>Hello!</div>
        );
    }
}

export default sdkConnect(Hello);
```

Call `this.props.ui.setBadgeCount()` to set the badge number displayed above the app icon. The badge is invisible when the value is zero.

![screenshot](/images/props-ui-1.png)

```jsx
import React from 'react';
import { sdkConnect } from 'deskpro-react-sdk';

class Hello extends React.Component {
    componentDidMount() {
        this.props.ui.setBadgeCount(3);
    }
    
    render() {
        return (
            <div>Hello!</div>
        );
    }
}

export default sdkConnect(Hello);
```


