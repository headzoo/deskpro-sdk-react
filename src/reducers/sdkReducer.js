import initialState from '../store/initialState';
import { nextUUID } from '../utils/uuid';
import * as types from '../actions/actionTypes';

/**
 * Splits the given value by the ':' character and returns the second value
 *
 * Example:
 *
 * ```js
 * const key = splitKey('entity:foo');
 * console.log(key);
 *
 * // Outputs: 'foo'
 * ```
 *
 * @param {string} key
 * @returns {string}
 */
function splitKey(key) {
  return key.split(':', 2).pop();
}

/**
 * Handles types.SDK_APP_VALUES
 *
 * @param {*} state
 * @returns {*}
 */
function reduceReady(state) {
  return {
    ...state,
    ready: true
  };
}

/**
 * Handles types.SDK_ERROR
 *
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function reduceError(state, action) {
  const msg    = String(action.error);
  const errors = state.errors.slice(0);
  const found  = errors.find((e) => {
    return e.msg === msg;
  });

  if (!found) {
    errors.push({
      id: nextUUID(),
      msg
    });
  }

  return {
    ...state,
    errors
  };
}

/**
 * Handles types.SDK_CLEAR_ERRORS
 *
 * @param {*} state
 * @returns {*}
 */
function reduceClearErrors(state) {
  return {
    ...state,
    errors: []
  };
}

/**
 * Handles types.SDK_ME
 *
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function reduceMe(state, action) {
  return {
    ...state,
    me: Object.assign({}, action.data)
  };
}

/**
 * Handles types.SDK_TAB_DATA
 *
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function reduceTabData(state, action) {
  return {
    ...state,
    tabData: Object.assign({}, action.data)
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function reduceToRoute(state, action) {
  const prevRoute = state.route;
  if (prevRoute.location === action.location) {
    if (JSON.stringify(prevRoute.params) === JSON.stringify(action.params)) {
      console.error('Route infinite loop detected.');
      return state;
    }
  }

  return {
    ...state,
    route: {
      location: action.location,
      params:   action.params
    }
  };
}

/**
 * Handles types.SDK_APP_VALUE
 *
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function reduceAppValue(state, action) {
  const app = Object.assign({}, state.storage.app);

  if (typeof action.key === 'object') {
    Object.keys(action.key).forEach((k) => {
      const key = splitKey(k);
      app[key]  = action.key[k];
    });
  } else {
    const key = splitKey(action.key);
    app[key]  = action.value;
  }

  return {
    ...state,
    storage: Object.assign({}, state.storage, { app })
  };
}

/**
 * Handles types.SDK_ENTITY_VALUE
 *
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function reduceEntityValue(state, action) {
  const entity = Object.assign({}, state.storage.entity);

  if (typeof action.key === 'object') {
    Object.keys(action.key).forEach((k) => {
      const key   = splitKey(k);
      entity[key] = action.key[k];
    });
  } else {
    const key   = splitKey(action.key);
    entity[key] = action.value;
  }

  return {
    ...state,
    storage: Object.assign({}, state.storage, { entity })
  };
}

/**
 * Handles types.SDK_OAUTH_PROVIDER
 *
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function reduceOauthProvider(state, action) {
  const oauth = Object.assign({}, state.oauth);
  oauth.providers[action.provider] = action.settings;

  return {
    ...state,
    oauth
  };
}

const reducers = {
  [types.SDK_READY]:          reduceReady,
  [types.SDK_ERROR]:          reduceError,
  [types.SDK_CLEAR_ERRORS]:   reduceClearErrors,
  [types.SDK_ME]:             reduceMe,
  [types.SDK_TAB_DATA]:       reduceTabData,
  [types.SDK_TO_ROUTE]:       reduceToRoute,
  [types.SDK_APP_VALUE]:      reduceAppValue,
  [types.SDK_ENTITY_VALUE]:   reduceEntityValue,
  [types.SDK_OAUTH_PROVIDER]: reduceOauthProvider
};

/**
 * SDK reducer
 *
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
export default function sdkReducer(state = initialState.sdk, action = {}) {
  if (reducers[action.type] !== undefined) {
    return reducers[action.type](state, action);
  }
  return state;
}
