import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import sdk from './sdkReducer';

/**
 * Creates and returns the root reducer which is passed to the store
 *
 * @param {*} reducers Additional reducers
 * @returns {*}
 */
export default function configureRootReducer(reducers = {}) {
  return combineReducers({
    form,
    sdk,
    ...reducers
  });
}
