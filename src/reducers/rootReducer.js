import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import sdk from './sdkReducer';

const rootReducer = combineReducers({
  form,
  sdk
});

export default rootReducer;
