# Overview

This page will help you install and build your first DeskproApps app using the React SDK.

Four items are required in order to get started developing applications:

1. Access to the latest version of [DeskPRO](https://www.deskpro.com). The minimum version is XXX-YYY. You can use an existing installation if it was updated
or you can go to the [downloads]((https://support.deskpro.com/en/downloads)) page and pick your distribution.
2. A recent version of nodejs and npm running on your machine. We recommend nodejs 6 and npm 3.10
3. A clone of [Deskpro Apps Boilerplate repository](https://github.com/deskpro/deskproapps-boilerplate-react)
4. The [Deskpro Apps Tool](https://github.com/deskpro/deskproapps-dpat) present on your machine. This is the official build tool for DeskPRO Apps and you will need it at least for packaging your application in the format required for installation.

## Example

```jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * A link which dispatches to a route location when clicked.
 */
class Link extends React.Component {
  static propTypes = {
    /**
     * Route that will be dispatched when the button is clicked.
     */
    to:       PropTypes.string,
    /**
     * Children rendered into the button.
     */
    children: PropTypes.node,
    /**
     * Called when the button is clicked.
     */
    onClick:  PropTypes.func
  };

  static defaultProps = {
    to:       '',
    children: '',
    onClick:  () => {}
  };

  static contextTypes = {
    route: PropTypes.object
  };

  /**
   * Called when the link is clicked
   *
   * Dispatches to the 'to' route unless the default is prevented.
   *
   * @param {Event} e
   */
  handleClick = (e) => {
    this.props.onClick(e);
    if (!e.defaultPrevented) {
      this.context.route.to(this.props.to);
      e.preventDefault();
    }
  };

  /**
   * @returns {XML}
   */
  render() {
    const { children, ...props } = this.props;

    return (
      <a {...props} onClick={this.handleClick}>
        {children}
      </a>
    );
  }
}

export default Link;
```
