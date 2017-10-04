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
    this.location = route.location;
    this.params   = route.params;
  }

  /**
   *
   * @param {string} location
   * @param {*} params
   */
  to = (location, params = {}) => {
    this.dispatch(toRoute(location, params));
  };
}
