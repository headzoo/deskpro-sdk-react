import PropTypes from 'prop-types';

const { shape, object, string, func, number, bool, array } = PropTypes;

/**
 * Defines the prop type for dpapp
 */
export const dpappPropType = shape({
  properties:  object,
  environment: string,
  settings:    object,
  context:     object,
  ui:          object,
  restApi:     object,
  storage:     object,
  oauth:       object,
  appId:       string,
  appTitle:    string,
  packageName: string,
  instanceId:  string,
  refresh:     func,
  unload:      func
});

/**
 * Defines the prop type for dpapp.ui
 */
export const uiPropType = shape({
  error:          func,
  collapse:       func,
  expand:         func,
  hide:           func,
  show:           func,
  hideBadgeCount: func,
  showBadgeCount: func,
  hideLoading:    func,
  showLoading:    func,
  hideMenu:       func,
  showMenu:       func,
  isCollapsed:    func,
  isExpanded:     func,
  isHidden:       func,
  isLoading:      func,
  isReady:        func,
  isVisible:      func
});

/**
 * Defines the storage prop type
 */
export const storagePropType = shape({
  app:       object,
  entity:    object,
  getApp:    func,
  setApp:    func,
  getEntity: func,
  setEntity: func
});

/**
 * Defines the Redux store prop type
 */
export const storePropType = shape({
  getState:       func,
  dispatch:       func,
  subscribe:      func,
  replaceReducer: func
});

/**
 * Defines the "me" prop type
 */
export const mePropType = shape({
  id:              number,
  avatar:          object,
  can_admin:       bool,
  can_agent:       bool,
  can_billing:     bool,
  is_agent:        bool,
  is_confirmed:    bool,
  is_contact:      bool,
  is_deleted:      bool,
  is_disabled:     bool,
  is_user:         bool,
  was_agent:       bool,
  online:          bool,
  labels:          array,
  teams:           array,
  phone_numbers:   array,
  date_created:    string,
  date_last_login: string,
  name:            string,
  display_name:    string,
  first_name:      string,
  last_name:       string,
  primary_email:   object,
  emails:          array,
  gravatar_url:    string,
  tickets_count:   number,
  timezone:        string
});

/**
 * Defines the tabData prop type
 */
export const tabDataPropType = shape({
  id:                             number,
  is_hold:                        bool,
  access_code:                    string,
  access_code_email_body_token:   string,
  access_code_email_header_token: string,
  agent:                          object,
  attachments:                    array,
  auth:                           string,
  category:                       object,
  count_agent_replies:            number,
  count_user_replies:             number,
  current_user_waiting:           number,
  current_user_waiting_work:      number,
  custom_data:                    array,
  date_agent_waiting:             string,
  date_agent_waiting_ts:          number,
  date_agent_waiting_ts_ms:       number,
  date_archived:                  string,
  date_archived_ts:               number,
  date_archived_ts_ms:            number,
  date_created:                   string,
  date_created_ts:                number,
  date_created_ts_ms:             number,
  date_feedback_rating_ts:        number,
  date_feedback_rating_ts_ms:     number,
  date_first_agent_assign:        string,
  date_first_agent_assign_ts:     number,
  date_first_agent_assign_ts_ms:  number,
  date_first_agent_reply:         string,
  date_first_agent_reply_ts:      number,
  date_first_agent_reply_ts_ms:   number,
  date_last_agent_reply:          string,
  date_last_agent_reply_ts:       number,
  date_last_agent_reply_ts_ms:    number,
  date_last_user_reply:           string,
  date_last_user_reply_ts:        number,
  date_last_user_reply_ts_ms:     number,
  date_locked:                    string,
  date_locked_ts:                 number,
  date_locked_ts_ms:              number,
  date_on_hold:                   string,
  date_on_hold_ts:                number,
  date_on_hold_ts_ms:             number,
  date_resolved:                  string,
  date_resolved_ts:               number,
  date_resolved_ts_ms:            number,
  date_status:                    string,
  date_status_ts:                 number,
  date_status_ts_ms:              number,
  date_user_waiting:              string,
  date_user_waiting_ts:           number,
  date_user_waiting_ts_ms:        number,
  department:                     object,
  has_attachments:                bool,
  hidden_status:                  string,
  labels:                         array,
  language:                       object,
  organization:                   object,
  original_subject:               string,
  parent_ticket:                  string,
  participants:                   array,
  person:                         object,
  person_email:                   object,
  priority:                       string,
  product:                        object,
  ref:                            string,
  sent_to_address:                string,
  status:                         string,
  subject:                        string,
  ticket_hash:                    string,
  ticket_slas:                    object,
  total_to_first_reply:           number,
  total_to_first_reply_work:      number,
  total_to_resolution:            number,
  total_to_resolution_work:       number,
  total_user_waiting:             number,
  total_user_waiting_real:        number,
  total_user_waiting_work:        number,
  urgency:                        number,
  waiting_times:                  array,
  workflow:                       object,
  worst_sla_status:               string
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
