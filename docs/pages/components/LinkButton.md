Overview
========
The `LinkButton` component changes the current route location when clicked. See the [route documentation](/pages/props/#route) for more information.

## Props

```jsx
<LinkButton
    to={string}
    params={object}
/>
```

## Example
The following example renders two buttons which change the current location when clicked.

```jsx
import React from 'react';
import { LinkButton, sdkConnect } from 'deskpro-sdk-react';

class Page extends React.Component {
    render() {
        return (
            <div>
                <LinkButton to="settings">
                    Click
                </Link>
                <LinkButton to="settings" params={{ country: 'uk' }}>
                    Click
                </Link>
            </div>
        );
    }
}

export default sdkConnect(Page);
```

!!! note
    Components using the `LinkButton` component must be [connected to the SDK](/pages/props/#connecting-your-components) using `sdkConnect` or `DeskproSDK`.
