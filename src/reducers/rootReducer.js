import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import sdk from './sdkReducer';

export default function configureRootReducer(reducers = {}) {
  return combineReducers({
    form,
    sdk,
    ...reducers
  });
}
