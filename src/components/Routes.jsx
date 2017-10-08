import React from 'react';
import PropTypes from 'prop-types';
import Route from './Route';

/**
 * Ensures the Routes children are of type Route
 *
 * @returns {*}
 */
const childrenPropType = (props, propName, componentName) => {
  const prop = props[propName];
  let error  = null;
  React.Children.forEach(prop, (child) => {
    if (child.type !== Route) {
      error = new Error(`${componentName} children should be of type 'Route'`);
    }
  });

  return error;
};

/**
 * Renders the child which matches the current route.
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
export default class Routes extends React.Component {
  static propTypes = {
    /**
     * Name of the route to render. Overrides the location in the store.
     */
    to: PropTypes.string,

    /**
     * Child components.
     */
    children: childrenPropType
  };

  /**
   * Specifies the default values for props
   */
  static defaultProps = {
    to:       '',
    children: []
  };

  /**
   * Context values the child wants passed down from the parent
   */
  static contextTypes = {
    route: PropTypes.object
  };

  /**
   * Invoked immediately before mounting occurs
   */
  componentDidMount() {
    if (this.props.to === '' && this.context.route === undefined) {
      throw new Error('Route context not found. Did you forget to use sdkConnect?');
    }
  }

  /**
   * Creates or clones the component stored in the given route
   *
   * @param {Route} route
   * @returns {XML}
   */
  createRouteComponent = (route) => {
    if (route.props.component) {
      return React.createElement(route.props.component);
    }
    return React.cloneElement(React.Children.only(route.props.children));
  };

  /**
   * @returns {XML}
   */
  render() {
    const location = this.props.to || this.context.route.location;
    const routes   = React.Children.toArray(this.props.children);

    let defaultRoute = null;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].props.location === location) {
        return this.createRouteComponent(routes[i]);
      }
      if (routes[i].props.defaultRoute) {
        defaultRoute = routes[i];
      }
    }
    if (defaultRoute) {
      return this.createRouteComponent(defaultRoute);
    }

    throw new Error(`Route not found for location '${location}' and defaultRoute not found.`);
  }
}
