import * as sdkActions from '../actions/sdkActions';

export default class UI {
  /**
   * Constructor
   *
   * @param {Function} dispatch
   * @param {*} values
   * @param {App} dpapp
   */
  constructor(dispatch, values, dpapp) {
    this.dispatch = dispatch;
    this.dpapp    = dpapp;
    this.setValues(values);
  }

  /**
   * @param {*} values
   */
  setValues = (values) => {
    const uiValues = Object.assign({}, values);
    Object.keys(uiValues).forEach((key) => {
      Object.defineProperty(this, key, {
        value:        values[key],
        configurable: false,
        writable:     false
      });
    });
  };

  /**
   * Pushes a message into the list of errors
   *
   * @param {string} message
   */
  error = (message) => {
    this.dispatch(sdkActions.error(message));
  };

  /**
   * Sets the badge count
   *
   * @param {number} count
   */
  setBadgeCount = (count) => {
    this.dispatch(sdkActions.badgeCount(count));
    this.dpapp.ui.badgeCount = count;
    if (count > 0) {
      this.dpapp.ui.showBadgeCount();
    } else {
      this.dpapp.ui.hideBadgeCount();
    }
  };

  /**
   * Shows or hides the loading animation
   *
   * @param {bool} loading
   */
  setLoading = (loading) => {
    this.dispatch(sdkActions.loading(loading));
  };
}
