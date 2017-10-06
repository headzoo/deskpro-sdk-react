import React from 'react';
import PropTypes from 'prop-types';

/**
 * Used by the Routes component to match components to route locations.
 *
 * Example:
 *
 * ```jsx
 * <Routes>
 *  <Route location="settings" component={PageSettings} />
 *  <Route location="index" component={PageIndex} />
 *  <Route defaultRoute component={PageNotFound} />
 * </Routes>
 * ```
 */
export default class Route extends React.Component {
  static propTypes = {
    location:     PropTypes.string,
    defaultRoute: PropTypes.bool,
    component:    PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    children:     PropTypes.node
  };

  static defaultProps = {
    location:     '',
    children:     '',
    component:    '',
    defaultRoute: false
  };

  /**
   * @returns {string}
   */
  location = () => {
    return this.props.location;
  };

  /**
   * @returns {React.Component}
   */
  component = () => {
    return this.props.component;
  };

  /**
   * @returns {boolean}
   */
  defaultRoute = () => {
    return this.props.defaultRoute;
  };

  /**
   * @returns {XML}
   */
  render() {
    if (this.props.component) {
      return React.createElement(this.props.component);
    }
    return this.props.children;
  }
}
