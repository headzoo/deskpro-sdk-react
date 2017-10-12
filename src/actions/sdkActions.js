import * as types from './actionTypes';

/**
 * Converts an object of key/value pairs into an array of key/value pairs
 *
 * Example:
 *
 * ```js
 * const pairs = createBatchStorage({
 *  foo: 'bar',
 *  baz: 'bee'
 * });
 *
 * console.log(pairs);
 *
 * // Outputs:
 * // [
 * //   ['foo', 'bar'],
 * //   ['baz', 'bee']
 * // ]
 * ```
 *
 * @param {*} obj
 * @returns {Array}
 */
export function createBatchStorage(obj) {
  const values = [];
  Object.keys(obj).forEach((key) => {
    values.push([key, obj[key]]);
  });

  return values;
}

/**
 * Sets the app in the ready state
 *
 * @param {bool} r
 * @returns {{type: SDK_READY, ready: bool}}
 */
export function ready(r = true) {
  return {
    type:  types.SDK_READY,
    ready: r
  };
}

/**
 * Sets the app in/out of a refreshing state
 *
 * @param {bool} r
 * @returns {{type: SDK_REFRESHING, refreshing: boolean}}
 */
export function refreshing(r = true) {
  return {
    type:       types.SDK_REFRESHING,
    refreshing: r
  };
}

/**
 * Sets the app in/out of the loading state
 *
 * @param {bool} l
 * @returns {{type: SDK_LOADING, loading: boolean}}
 */
export function loading(l = true) {
  return {
    type:    types.SDK_LOADING,
    loading: l
  };
}

/**
 * Pushes the given error to the list of stored errors
 *
 * @param {Error|string} e
 * @returns {{type: SDK_ERROR, error: Error|string}}
 */
export function error(e) {
  console.error(e);
  return {
    type:  types.SDK_ERROR,
    error: e
  };
}

/**
 * Clears the list of errors
 *
 * @returns {{type: SDK_CLEAR_ERRORS}}
 */
export function clearErrors() {
  return {
    type: types.SDK_CLEAR_ERRORS
  };
}

/**
 * Shows or hides the app
 *
 * @param {bool} [c]
 * @returns {{type: SDK_COLLAPSED, collapsed: *}}
 */
export function collapsed(c = true) {
  return {
    type:      types.SDK_COLLAPSED,
    collapsed: c
  };
}

/**
 * Sets the "me" object
 *
 * @param {*} data
 * @returns {{type: SDK_ME, me: *}}
 */
export function me(data) {
  return {
    type: types.SDK_ME,
    data
  };
}

/**
 * Sets the data for the currently opened tab
 *
 * @param {*} data
 * @returns {{type: SDK_TAB_DATA, data: *}}
 */
export function tabData(data) {
  return {
    type: types.SDK_TAB_DATA,
    data
  };
}

/**
 * Changes the route to the given location with the given params
 *
 * @param {string} location
 * @param {*} [params]
 * @returns {{type: SDK_TO_ROUTE, location: *, params: {}}}
 */
export function toRoute(location, params = {}) {
  return {
    type: types.SDK_TO_ROUTE,
    location,
    params
  };
}

/**
 * Save one or more app storage values to the store
 *
 * Examples:
 *
 * ```js
 * // Set the value of 'foo' to 'bar'.
 * dispatch(appValue('foo', 'bar'));
 *
 * // Sets all the given values.
 * dispatch(appValue({ foo: 'bar', baz: 'bee' });
 * ```
 *
 * @param {string|object} key
 * @param {*} [value]
 * @returns {{type: SDK_APP_VALUE, key: string, value: *}}
 */
export function appValue(key, value) {
  return {
    type: types.SDK_APP_VALUE,
    key,
    value
  };
}

/**
 * Save one or more entity storage values to the store
 *
 * Examples:
 *
 * ```js
 * // Set the value of 'foo' to 'bar'.
 * dispatch(entityValue('foo', 'bar'));
 *
 * // Sets all the given values.
 * dispatch(entityValue({ foo: 'bar', baz: 'bee' });
 * ```
 *
 * @param {string|object} key
 * @param {*} [value]
 * @returns {{type: SDK_ENTITY_VALUE, key: string, value: *}}
 */
export function entityValue(key, value) {
  return {
    type: types.SDK_ENTITY_VALUE,
    key,
    value
  };
}

/**
 * Saves the oauth settings
 *
 * @param {string} provider
 * @param {*} settings
 * @returns {{type: SDK_OAUTH_PROVIDER, provider: string, settings: *}}
 */
export function oauthProvider(provider, settings) {
  return {
    type: types.SDK_OAUTH_PROVIDER,
    provider,
    settings
  };
}

/**
 * Sets app storage values
 *
 * Examples:
 *
 * ```js
 * // Set the value for key 'foo' to 'bar'.
 * dispatch(appSetStorage('foo', 'bar'));
 *
 * // Set the values from the given key/value pairs.
 * dispatch(appSetStorage({ foo: 'bar', baz: 'bee' });
 *
 * // Set the values and call the callback once finished.
 * dispatch(appSetStorage({ foo: 'bar' }, () => {
 *  console.log('done');
 * });
 * ```
 *
 * @param {string|object} key
 * @param {*} [value]
 * @param {Function} [cb]
 * @returns {Function}
 */
export function appSetStorage(key, value, cb = () => {}) {
  return (dispatch, getState, { storage }) => {
    let promise;
    if (typeof key === 'object') {
      promise = storage.setAppStorage(createBatchStorage(key));
    } else {
      promise = storage.setAppStorage(key, value);
    }

    return promise.then(() => {
      dispatch(appValue(key, value));
      return cb();
    }).catch((e) => {
      cb();
      return dispatch(error(e));
    });
  };
}

/**
 * Retrieves app storage values
 *
 * Examples:
 *
 * ```js
 * // Fetch the value or return null if not found.
 * dispatch(appGetStorage('foo'));
 *
 * // Fetch the values for the given keys.
 * dispatch(appGetStorage(['foo', 'fee']));
 *
 * // Fetch the value or return 'bar' if not found.
 * dispatch(appGetStorage('foo', 'bar'));
 *
 * // Fetch the value and call the callback once finished.
 * dispatch(appGetStorage('foo', () => {
 *  console.log('done');
 * ));
 *
 * // Fetch the value, returning 'bar' if not found, and call the callback.
 * dispatch(appGetStorage('foo', 'bar', () => {
 *  console.log('done');
 * ));
 * ```
 *
 * @param {string|Array} key
 * @param {*|Function} [defaultValue]
 * @param {Function} [cb]
 * @returns {Function}
 */
export function appGetStorage(key, defaultValue = null, cb = () => {}) {
  if (typeof defaultValue === 'function') {
    cb = defaultValue;   // eslint-disable-line no-param-reassign
    defaultValue = null; // eslint-disable-line no-param-reassign
  }

  return (dispatch, getState, { storage }) => {
    return storage.getAppStorage(key, defaultValue)
      .then((value) => {
        if (Array.isArray(key)) {
          dispatch(appValue(value));
        } else {
          dispatch(appValue(key, value));
        }
        return cb();
      }).catch((e) => {
        cb();
        return dispatch(error(e));
      });
  };
}

/**
 * Sets entity storage values
 *
 * Examples:
 *
 * ```js
 * // Set the value for key 'foo' to 'bar'.
 * dispatch(entitySetStorage('foo', 'bar'));
 *
 * // Set the values from the given key/value pairs.
 * dispatch(entitySetStorage({ foo: 'bar', baz: 'bee' });
 *
 * // Set the values and call the callback once finished.
 * dispatch(entitySetStorage({ foo: 'bar' }, () => {
 *  console.log('done');
 * });
 * ```
 *
 * @param {string|object} key
 * @param {*} [value]
 * @param {Function} [cb]
 * @returns {Function}
 */
export function entitySetStorage(key, value, cb = () => {}) {
  return (dispatch, getState, { storage }) => {
    let promise;
    if (typeof key === 'object') {
      promise = storage.setEntityStorage(createBatchStorage(key));
    } else {
      promise = storage.setEntityStorage(key, value);
    }

    return promise.then(() => {
      dispatch(entityValue(key, value));
      return cb();
    }).catch((e) => {
      cb();
      return dispatch(error(e));
    });
  };
}

/**
 * Retrieves entity storage values
 *
 * Examples:
 *
 * ```js
 * // Fetch the value or return null if not found.
 * dispatch(entityGetStorage('foo'));
 *
 * // Fetch the values for the given keys.
 * dispatch(entityGetStorage(['foo', 'fee']));
 *
 * // Fetch the value or return 'bar' if not found.
 * dispatch(entityGetStorage('foo', 'bar'));
 *
 * // Fetch the value and call the callback once finished.
 * dispatch(entityGetStorage('foo', () => {
 *  console.log('done');
 * ));
 *
 * // Fetch the value, returning 'bar' if not found, and call the callback.
 * dispatch(entityGetStorage('foo', 'bar', () => {
 *  console.log('done');
 * ));
 * ```
 *
 * @param {string|Array} key
 * @param {*|Function} [defaultValue]
 * @param {Function} [cb]
 * @returns {Function}
 */
export function entityGetStorage(key, defaultValue = null, cb = () => {}) {
  if (typeof defaultValue === 'function') {
    cb = defaultValue;   // eslint-disable-line no-param-reassign
    defaultValue = null; // eslint-disable-line no-param-reassign
  }

  return (dispatch, getState, { storage }) => {
    return storage.getEntityStorage(key, defaultValue)
      .then((value) => {
        if (Array.isArray(key)) {
          dispatch(entityValue(value));
        } else {
          dispatch(entityValue(key, value));
        }
        return cb();
      }).catch((e) => {
        cb();
        return dispatch(error(e));
      });
  };
}

/**
 * Retrieves the oauth settings
 *
 * @param {string} provider
 * @param {Function} cb
 * @returns {Function}
 */
export function oauthGetSettings(provider, cb = () => {}) {
  return (dispatch, getState, { oauth }) => {
    return oauth.settings(provider)
      .then((settings) => {
        dispatch(oauthProvider(provider, settings));
        return cb();
      }).catch((e) => {
        cb();
        return dispatch(error(e));
      });
  };
}
