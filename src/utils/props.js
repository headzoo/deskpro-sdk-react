import PropTypes from 'prop-types';
import * as sdkActions from '../actions/sdkActions';
import Storage from './storage';
import Route from './route';

/**
 * Defines the prop type for dpapp
 */
export const dpappPropType = PropTypes.shape({
  properties:  PropTypes.object,
  environment: PropTypes.object,
  settings:    PropTypes.object,
  context:     PropTypes.object,
  ui:          PropTypes.object,
  restApi:     PropTypes.object,
  storage:     PropTypes.object,
  oauth:       PropTypes.object,
  appId:       PropTypes.string,
  appTitle:    PropTypes.string,
  packageName: PropTypes.string,
  instanceId:  PropTypes.string,
  refresh:     PropTypes.func,
  unload:      PropTypes.func
});

/**
 * Defines the prop type for dpapp.ui
 */
export const uiPropType = PropTypes.shape({
  error:          PropTypes.func,
  collapse:       PropTypes.func,
  expand:         PropTypes.func,
  hide:           PropTypes.func,
  show:           PropTypes.func,
  hideBadgeCount: PropTypes.func,
  showBadgeCount: PropTypes.func,
  hideLoading:    PropTypes.func,
  showLoading:    PropTypes.func,
  hideMenu:       PropTypes.func,
  showMenu:       PropTypes.func,
  isCollapsed:    PropTypes.func,
  isExpanded:     PropTypes.func,
  isHidden:       PropTypes.func,
  isLoading:      PropTypes.func,
  isReady:        PropTypes.func,
  isVisible:      PropTypes.func
});

/**
 * Defines the storage prop type
 */
export const storagePropType = PropTypes.shape({
  app:       PropTypes.object,
  entity:    PropTypes.object,
  getApp:    PropTypes.func,
  setApp:    PropTypes.func,
  getEntity: PropTypes.func,
  setEntity: PropTypes.func
});

/**
 * Defines the Redux store prop type
 */
export const storePropType = PropTypes.shape({
  getState:       PropTypes.func,
  dispatch:       PropTypes.func,
  subscribe:      PropTypes.func,
  replaceReducer: PropTypes.func
});

/**
 * Defines the "me" prop type
 */
export const mePropType = PropTypes.shape({
  id:              PropTypes.number,
  avatar:          PropTypes.object,
  can_admin:       PropTypes.bool,
  can_agent:       PropTypes.bool,
  can_billing:     PropTypes.bool,
  is_agent:        PropTypes.bool,
  is_confirmed:    PropTypes.bool,
  is_contact:      PropTypes.bool,
  is_deleted:      PropTypes.bool,
  is_disabled:     PropTypes.bool,
  is_user:         PropTypes.bool,
  was_agent:       PropTypes.bool,
  online:          PropTypes.bool,
  labels:          PropTypes.array,
  teams:           PropTypes.array,
  phone_numbers:   PropTypes.array,
  date_created:    PropTypes.string,
  date_last_login: PropTypes.string,
  name:            PropTypes.string,
  display_name:    PropTypes.string,
  first_name:      PropTypes.string,
  last_name:       PropTypes.string,
  primary_email:   PropTypes.string,
  emails:          PropTypes.array,
  gravatar_url:    PropTypes.string,
  tickets_count:   PropTypes.number,
  timezone:        PropTypes.string
});

/**
 * Performs a key comparison between two objects, deleting from the first where
 * the keys exist in the second
 *
 * Can be used to remove unwanted component prop values. For example:
 *
 * ```jsx
 * render() {
 *   const { children, className, ...props } = this.props;
 *
 *    return (
 *      <div
 *        {...propKeyFilter(props, Item.propTypes)}
 *        className={classNames('dp-item', className)}
 *       >
 *        {children}
 *      </div>
 *    )
 * }
 * ```
 *
 * @param {Object} obj1
 * @param {Object} obj2
 * @returns {*}
 */
export function propKeyFilter(obj1, obj2) {
  const obj2Keys = Object.keys(obj2);
  const newProps = Object.assign({}, obj1);
  Object.keys(newProps)
    .filter(key => obj2Keys.indexOf(key) !== -1)
    .forEach(key => delete newProps[key]);

  return newProps;
}

/**
 * Creates the props to be passed to sdk connected components
 *
 * @param {{ dpapp: *, dispatch: Function, form: *, sdk: * }} props
 * @returns {{oauth: *, context: *, route: *, storage: *, dispatch: *, dpapp: *, form: *, ui}}
 */
export function buildConnectedProps(props) {
  const { dpapp, dispatch, sdk } = props;

  const tabData = Object.assign({}, sdk.tabData);
  const form    = Object.assign({}, props.form);
  const me      = Object.assign({}, sdk.me);
  const ui      = Object.assign({}, dpapp.ui);

  ui.error = (error) => {
    dispatch(sdkActions.error(error));
  };

  return {
    oauth:   dpapp.oauth,
    context: dpapp.context,
    route:   new Route(dispatch, sdk.route),
    storage: new Storage(dispatch, sdk.storage),
    dispatch,
    tabData,
    dpapp,
    form,
    me,
    ui
  };
}
