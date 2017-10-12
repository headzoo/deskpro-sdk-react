import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dpappPropType } from './props';
import * as sdkActions from '../actions/sdkActions';
import Storage from './storage';
import Route from './route';
import UI from './ui';

/**
 * Creates the SDK props which get passed to connected components
 *
 * @param {{ dpapp: *, dispatch: Function, form: *, sdk: * }} props
 * @returns {{oauth: *, context: *, route: *, storage: *, store: *, dpapp: *, form: *, ui}}
 */
export function sdkProps(props) {
  const { dpapp, store, sdk } = props;

  const dispatch  = store.dispatch;
  const me        = Object.assign({}, sdk.me);
  const tabData   = Object.assign({}, sdk.tabData);
  const context   = dpapp.context;
  const oauth     = dpapp.oauth;
  const storage   = new Storage(dispatch, sdk.storage);
  const route     = new Route(dispatch, sdk.route);
  const ui        = new UI(dispatch, sdk.ui, dpapp);
  oauth.providers = sdk.oauth.providers;

  return {
    context,
    storage,
    dispatch,
    tabData,
    route,
    oauth,
    dpapp,
    me,
    ui
  };
}


/**
 * Provides the wrapped component with the dpapp context
 *
 * @param {React.Component|Function} WrappedComponent
 * @returns {React.Component}
 */
export const dpappProvider = (WrappedComponent) => {
  return class extends React.Component {
    static contextTypes = {
      dpapp: dpappPropType,
      store: PropTypes.object
    };

    render() {
      const connectedProps = Object.assign({}, this.props, this.context);

      return (
        <WrappedComponent
          {...sdkProps(connectedProps)}
          {...this.props}
        />
      );
    }
  };
};

/**
 * Connects the wrapped component to the sdk services and storage values
 *
 * Example:
 * ```jsx
 * import React from 'react';
 * import { sdkConnect } from 'deskpro-sdk-react';
 *
 * const App = () => (
 *  <div>App!</div>
 * );
 *
 * export default sdkConnect(App);
 * ```
 *
 * @param {React.Component|Function} WrappedComponent
 * @param {Function} [mapStateToProps]
 * @param {Function} [mapDispatchToProps]
 * @returns {React.Component}
 */
export const sdkConnect = (WrappedComponent, mapStateToProps, mapDispatchToProps) => {
  const mapper = (state) => {
    const sdk  = Object.assign({}, state.sdk);
    const form = Object.assign({}, state.form);

    let props = {};
    if (mapStateToProps) {
      props = mapStateToProps(state);
    }

    return {
      ...props,
      form,
      sdk
    };
  };

  return connect(mapper, mapDispatchToProps)(dpappProvider(WrappedComponent));
};
