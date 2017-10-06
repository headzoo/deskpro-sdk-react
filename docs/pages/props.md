Overview
========
The SDK automatically passes a number of objects to your components via props. Some of the SDK props contain values about the running application and current context, and some provide methods to interact with the DeskPRO application. For instance the [storage]() prop which allows developers to persist values with the DeskPRO application, and the [oauth]() prop for authenticating with remote services.

This document describes the SDK props and how to use them.

## Connecting your components
Components which need access to the SDK props must be _connected_ to the SDK. The [DeskproSDK component](/pages/components/DeskproSDK/) automatically connects the wrapped component.

The `<App />` component in the following example will have the props passed to it.

```jsx
ReactDOM.render(
    <DeskproSDK dpapp={dpapp} store={store}>
      <App />
    </DeskproSDK>,
    document.getElementById('deskpro-app')
);
```

The `sdkConnect` function connects the other components in your app which need the SDK props. Its usage is optional, and is only required when a component needs access to the props.

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

----

## Storage
Connected components receive the prop `this.props.storage`, an object which allows the developer to save values with the DeskPRO application. The values are persisted from one invocation of the app and another, and may be associated with the app or the current context.

Use the `this.props.storage.setApp()` method to persist values with DeskPRO which need to be associated with the app. The method takes an object of key/value pairs.

```js
this.props.storage.setApp({ country: 'uk' });
```

Saved values are read from the `this.props.storage.app` object.

```js
const country = this.props.storage.app.country;
```

The following example displays a list of countries and saves the selected value to _app_ storage.

```jsx
import React from 'react';
import { sdkConnect } from 'deskpro-sdk-react';
import { Form, Select, Button } from 'deskpro-components/lib/bindings/redux-form';

class PageCountry extends React.Component {
    handleSubmit = (values) => {
        this.props.storage.setApp({ country: values.country });
    };
    
    render() {
        const initialValues = {
            country: this.props.storage.app.country
        };
        const options = [
            { label: 'United Kingdom', value: 'uk' },
            { label: 'United States', value: 'us' }
        ];

        return (
            <Form
                name="countries"
                onSubmit={this.handleSubmit}
                initialValues={initialValues}
            >
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

Use the `this.props.storage.setEntity()` method to persist values with DeskPRO which need to be associated with the current _context_. For example the currently opened ticket. The method takes an object of key/value pairs.

```js
this.props.storage.setEntity({ note: '...' });
```

Saved values are read from the `this.props.storage.entity` object.

```js
const note = this.props.storage.entity.note;
```

## Route
Connected components receive the prop `this.props.route`, a light-weight router which may be used to switch between pages and tabs within an application. The route object contains two properties:

* `this.props.route.location` - A string with the name of the current page or tab
* `this.props.route.params` - An object of key/value pairs associated with the location

The following example uses the route object and a `switch` statement to display a different page based on the current location.

```js
import React from 'react';
import { sdkConnect } from 'deskpro-sdk-react';
import PageAccount from './PageAccount';
import PageIndex from './PageIndex';

class Content extends React.Component {
    render() {
        const { route } = this.props;
        
        switch (route.location) {
          case 'settings':
            return <PageAccount id={route.params.id} />;
          case 'index':
            return <PageIndex />;
        }
    }
}

export default sdkConnect(Content);
```

Apps change the location by calling the `this.props.route.to()` method, which takes the name of the new location.

```js
this.props.route.to('index');
```

Params may also be passed along with the location.

```js
this.props.route.to('account', { id: 5 });
```

Connected components may also change the location using the `Link` and `LinkButton` components.

```js
import React from 'react';
import { sdkConnect, Link } from 'deskpro-sdk-react';

class Menu extends React.Component {
    render() {
        return (
            <ul>
                <li>
                    <Link to="account" params={{ id: 5 }}>
                        Account
                    </Link>
                </li>
                <li>
                    <Link to="index">
                        Home
                    </Link>
                </li>
            </ul>
        );
    }
}

export default sdkConnect(Menu);
```


**See also**

* [Link](/pages/components/Link)
* [LinkButton](/pages/components/LinkButton)


## OAuth
Connected components receive the prop `this.props.oauth`, an object which authenticates with remote services and stores oauth credentials.

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

## Form
Connected components receive the prop `this.props.form`, an object of the values saved in the _store_ for each submitted form. See the [forms documentation](/pages/components/forms) for more information.

## TabData
Connected components receive the prop `this.props.tabData`, an object containing the details of the currently opened ticket. The object contains the following properties:

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

## Me
Connected components receive the prop `this.props.me`, an object containing the details of the agent/admin using the app. The object contains the following properties:

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

## UI
Connected components receive the prop `this.props.ui`, an object containing methods which allow you to manipulate the UI.

## DPApp
Connected components receive the prop `this.props.dpapp`, an object...
