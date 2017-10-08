import { toRoute } from '../actions/sdkActions';

export default class Route {
  /**
   * Constructor
   *
   * @param {Function} dispatch
   * @param {*} route
   */
  constructor(dispatch, route) {
    this.dispatch = dispatch;
    this.setValues(route);
  }

  /**
   * @param {*} values
   */
  setValues = (values) => {
    const routeValues = Object.assign({}, values);
    Object.keys(routeValues).forEach((key) => {
      Object.defineProperty(this, key, {
        value:        values[key],
        configurable: false,
        writable:     false
      });
    });
  };

  /**
   *
   * @param {string} location
   * @param {*} params
   */
  to = (location, params = {}) => {
    this.dispatch(toRoute(location, params));
  };
}
