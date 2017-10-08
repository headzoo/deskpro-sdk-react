import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UIConstants } from '@deskproapps/deskproapps-sdk-core';
import { Heading, Icon, Loader, Alert, DrawerList, Drawer } from 'deskpro-components';
import { dpappPropType, storePropType } from '../utils/props';
import * as sdkActions from '../actions/sdkActions';
import { sdkProps } from '../utils/connect';
import Route from '../utils/route';
import AppIcon from './AppIcon';

/**
 * Connects DeskPRO apps to the DeskPRO API
 *
 * Provides SDK props to a wrapped component. The props provide information about the app
 * and have methods which communicate with the API.
 *
 * Example:
 *
 * ```jsx
 * import ReactDOM from 'react-dom';
 * import { DeskproSDK, configureStore } from 'deskpro-sdk-react';
 * import App from './App';
 *
 * export function runApp(dpapp) {
 *  const store = configureStore(dpapp);
 *
 *  ReactDOM.render(
 *    <DeskproSDK dpapp={dpapp} store={store}>
 *      <App />
 *    </DeskproSDK>,
 *    document.getElementById('deskpro-app')
 *  );
 * }
 * ```
 */
class DeskproSDK extends React.Component {
  static propTypes = {
    /**
     * Instance of sdk-core.
     */
    dpapp: dpappPropType.isRequired,

    /**
     * Instance of the redux store.
     */
    store: storePropType.isRequired,

    /**
     * The sdk values stored in the store.
     */
    sdk: PropTypes.object.isRequired,

    /**
     * Bound action creators.
     */
    actions: PropTypes.object.isRequired,

    /**
     * The app component.
     */
    children: PropTypes.element.isRequired
  };

  static childContextTypes = {
    dpapp: dpappPropType,
    store: storePropType,
    route: PropTypes.object
  };

  /**
   * @returns {{dpapp: *}}
   */
  getChildContext() {
    const { store } = this.props;

    return {
      dpapp: this.props.dpapp,
      route: new Route(store.dispatch, store.getState().sdk.route),
      store
    };
  }

  /**
   * Bootstraps the application
   */
  componentDidMount = () => {
    const { actions } = this.props;

    Promise.all([
      ...this.bootstrapMe(),
      ...this.bootstrapTabData(),
      ...this.bootstrapStorage()
    ])
      .then(() => {
        return actions.ready();
      })
      .catch((error) => {
        return actions.error(error);
      });
  };

  /**
   * Fetches the "me" data for the user
   *
   * @returns {Promise[]}
   */
  bootstrapMe = () => {
    const { dpapp, actions } = this.props;

    const promise = dpapp.restApi.get('/me')
      .then((resp) => {
        try {
          return Promise.resolve(actions.me(resp.body.data.person));
        } catch (e) {
          return Promise.resolve({});
        }
      });

    return [promise];
  };

  /**
   * Fetches the data for the active tab
   *
   * @returns {Promise[]}
   */
  bootstrapTabData = () => {
    const { dpapp, actions } = this.props;

    const promise = dpapp.context.getTabData()
      .then((resp) => {
        try {
          return Promise.resolve(actions.tabData(resp.api_data));
        } catch (e) {
          return Promise.resolve({});
        }
      });

    return [promise];
  };

  /**
   * Fetches the manifest storage values
   *
   * @returns {Promise[]}
   */
  bootstrapStorage = () => {
    const { dpapp, actions } = this.props;

    const promises = [];
    const items = dpapp.manifest.storage || dpapp.manifest.state;
    if (items && items.length > 0) {
      const appKeys    = [];
      const entityKeys = [];
      const oauthKeys  = [];

      items.forEach((item) => {
        if (item.name.indexOf('oauth:') === 0) {
          oauthKeys.push(
            item.name.replace('oauth:', '')
          );
        } else if (item.name.indexOf('entity:') === 0) {
          entityKeys.push(
            item.name.replace('entity:', '')
          );
        } else {
          appKeys.push(
            item.name.replace('app:', '')
          );
        }
      });

      if (appKeys.length > 0) {
        promises.push(actions.appGetStorage(appKeys));
      }
      if (entityKeys.length > 0) {
        promises.push(actions.entityGetStorage(entityKeys));
      }
      oauthKeys.forEach((key) => {
        promises.push(actions.oauthGetSettings(key));
      });
    }

    return promises;
  };

  /**
   * Renders the app menu toolbar
   *
   * @returns {*}
   */
  renderToolbar = () => {
    const { dpapp } = this.props;

    const controls = [];
    if (dpapp.ui.menu !== UIConstants.VISIBILITY_HIDDEN) {
      controls.push(
        <Icon key="refresh" name="refresh" onClick={dpapp.refresh} />
      );
    }

    return (
      <Heading controls={controls}>
        <AppIcon
          badgeCount={dpapp.ui.badgeCount}
          badgeVisible={dpapp.ui.badge === UIConstants.VISIBILITY_VISIBLE}
        />
        {dpapp.manifest.title}
      </Heading>
    );
  };

  /**
   * Renders SDK errors as alerts
   *
   * @returns {Array}
   */
  renderErrors = () => {
    return this.props.sdk.errors.map(error => (
      <Alert key={error.id} type="danger" style={{ margin: 10 }}>
        {error.msg}
      </Alert>
    ));
  };

  /**
   * Renders the loading animation
   *
   * @returns {XML}
   */
  renderLoading = () => {
    return (
      <div className="dp-text-center">
        <Loader />
      </div>
    );
  };

  /**
   * Renders the main app component
   *
   * @returns {XML}
   */
  renderApp = () => {
    return React.cloneElement(
      React.Children.only(this.props.children),
      sdkProps(this.props)
    );
  };

  /**
   * @returns {XML}
   */
  render() {
    return (
      <DrawerList>
        <Drawer className="dp-column-drawer--with-controls">
          {this.renderToolbar()}
          {this.renderErrors()}
          {!this.props.sdk.ready
            ? this.renderLoading()
            : this.renderApp()
          }
        </Drawer>
      </DrawerList>
    );
  }
}

/**
 * Maps redux state to component props
 *
 * @param {*} state
 * @returns {{sdk: *}}
 */
function mapStateToProps(state) {
  return {
    sdk: Object.assign({}, state.sdk)
  };
}

/**
 * Maps action creators to component props
 *
 * @param {object} dispatch
 * @returns {{actions: *}}
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(sdkActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeskproSDK);
