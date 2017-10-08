Overview
========
The `Link` component changes the current route location when clicked. See the [route documentation](/pages/props/#route) for more information.

## Props

```jsx
<Link
    to={string}
    params={object}
/>
```

## Example
The following example renders two links which change the current location when clicked.

```jsx
import React from 'react';
import { Link, sdkConnect } from 'deskpro-sdk-react';

class Page extends React.Component {
    render() {
        return (
            <div>
                <Link to="settings">
                    Click
                </Link>
                <Link to="settings" params={{ country: 'uk' }}>
                    Click
                </Link>
            </div>
        );
    }
}

export default sdkConnect(Page);
```

!!! note
    Components using the `Link` component must be [connected to the SDK](/pages/props/#connecting-your-components) using `sdkConnect` or `DeskproSDK`.
