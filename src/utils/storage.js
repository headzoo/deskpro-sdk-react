import { appSetStorage, appGetStorage, entitySetStorage, entityGetStorage } from '../actions/sdkActions';

/**
 *
 */
export default class Storage {
  /**
   * Constructor
   *
   * @param {Function} dispatch
   * @param {*} values
   */
  constructor(dispatch, values) {
    this.dispatch = dispatch;
    this.setValues(values);
  }

  /**
   * @param {*} values
   */
  setValues = (values) => {
    this.app      = {};
    this.entity   = {};

    const storageValues = Object.assign({}, values);
    Object.keys(storageValues.app).forEach((key) => {
      this.app[key] = storageValues.app[key];
    });
    Object.keys(storageValues.entity).forEach((key) => {
      this.entity[key] = storageValues.entity[key];
    });
  };

  /**
   * @todo Possibly remove this? Values can be obtained by props. This shouldn't be called directly.
   *
   * @param {string} key
   * @param {*} defaultValue
   */
  getApp = (key, defaultValue = null) => {
    this.dispatch(appGetStorage(key, defaultValue));
  };

  /**
   * @param {*} values
   * @param {Function} [cb]
   */
  setApp = (values, cb = () => {}) => {
    this.dispatch(appSetStorage(values, null, cb));
  };

  /**
   * @todo Possibly remove this? Values can be obtained by props. This shouldn't be called directly.
   *
   * @param {string} key
   * @param {*} defaultValue
   */
  getEntity = (key, defaultValue = null) => {
    this.dispatch(entityGetStorage(key, defaultValue));
  };

  /**
   * @param {*} values
   * @param {Function} [cb]
   */
  setEntity = (values, cb = () => {}) => {
    this.dispatch(entitySetStorage(values, null, cb));
  };
}
