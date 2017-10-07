import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import configureRootReducer from '../reducers/rootReducer';

/**
 * Returns a new redux store instance
 *
 * Examples:
 *
 * ```js
 * // Creates the default sdk store.
 * const store = configureStore(dpapp);
 *
 * // Adds an additional reducer named "custom".
 * const customReducer = (state, action) => {
 *  return state;
 * }
 * const store = configureStore(dpapp, {
 *  custom: customReducer
 * });
 *
 * // Adds an additional reducer with initial state.
 * const customReducer = (state, action) => {
 *  return state;
 * }
 * const initialState = {
 *  custom: { foo: 'bar' }
 * }
 * const store = configureStore(dpapp, {
 *  custom: customReducer
 * }, initialState);
 * ```
 *
 * @param {*} dpapp          The sdk-core dpapp instance
 * @param {*} [reducers]     Additional reducers
 * @param {*} [initialState] Additional initial state
 * @returns {*}
 */
export default function configureStore(dpapp, reducers = {}, initialState = {}) {
  let composeEnhancers = compose;
  if (dpapp.environment === 'development') {
    if (window.parent && window.parent.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== undefined) {
      composeEnhancers = window.parent.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    } else if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== undefined) {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    }
  }

  return createStore(
    configureRootReducer(reducers),
    initialState,
    composeEnhancers(applyMiddleware(thunk.withExtraArgument(dpapp)))
  );
}
