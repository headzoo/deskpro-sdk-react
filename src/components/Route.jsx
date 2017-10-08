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
    /**
     * The name of the route.
     */
    location: PropTypes.string,

    /**
     * Whether or not this route acts as the default.
     */
    defaultRoute: PropTypes.bool,

    /**
     * The component to render when the route matches.
     */
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),

    /**
     * The children to render when the component prop is not used.
     */
    children: PropTypes.node
  };

  /**
   * Specifies the default values for props
   */
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
