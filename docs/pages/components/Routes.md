Routes
======
The SDK includes a light-weight router which displays different pages within DeskPRO apps. Routes locations are defined using simple names instead of addresses, because DeskPRO apps do not use the browser location (URL). The current location is changed by calling [this.props.route.to()](/pages/props/#route) with the name of the new location, or by using the [Link](/pages/components/Link) and [LinkButton](/pages/components/LinkButton) components.

## Example
First create a few pages for the app.

```jsx
// PageSettings.jsx
import React from 'react';
import { Link, sdkConnect } from 'deskpro-sdk-react';

const PageSettings = () => (
    <div>
        <h1>Settings</h1>
        <Link to="index">
            Go to index
        </Link>
    </div>
);

export default sdkConnect(PageSettings);
```

```jsx
// PageIndex.jsx
import React from 'react';
import { Link, sdkConnect } from 'deskpro-sdk-react';

const PageSettings = () => (
    <div>
        <h1>Index</h1>
        <Link to="settings">
            Go to settings
        </Link>
    </div>
);

export default sdkConnect(PageSettings);
```

```jsx
// PageNotFound.jsx
import React from 'react';

const PageNotFound = () => (
    <div>
        <h1>Not Found</h1>
    </div>
);

export default PageNotFound;
```

Now create the main app component which contains the `Routes`. The `Route` which matches the current location gets rendered. The route with the `defaultRoute` prop renders when no other routes match the current location.

```jsx
// App.jsx
import React from 'react';
import { Routes, Route, sdkConnect } from 'deskpro-sdk-react';
import PageSettings from './PageSettings';
import PageIndex from './PageIndex';
import PageNotFound from './PageNotFound';

class App extends React.Component {
  render() {
    return (
      <Routes>
        <Route location="settings" component={PageSettings} />
        <Route location="index" component={PageIndex} />
        <Route defaultRoute component={PageNotFound} />
      </Routes>
    );
  }
}

export default sdkConnect(App);
```

Routes may also be defined using child components instead of the `component` prop.

```jsx
<Routes>
    <Route location="settings">
        <PageSettings />
    </Route>
    <Route location="index">
        <PageIndex />
    </Route>
    <Route defaultRoute>
        <h1>Not Found</h1>
    </Route>
</Routes>
```

## Changing routes manually

The `this.props.route.to()` method may be used to change routes manually.

```jsx
import React from 'react';
import { sdkConnect } from 'deskpro-sdk-react';

class PageSettings extends Route.Component {
    handleClick = () => {
        this.props.route.to('index');
    };
    
    render() {
        return (
            <div>
                <h1>Settings</h1>
                <button onClick={this.handleClick}>
                    Go to index
                </button>
            </div>
        );
    }
};

export default sdkConnect(PageSettings);
```

## See also
* [this.props.route](/pages/props/#route)
* [Link](/pages/components/Link)
* [LinkButton](/pages/components/LinkButton)
