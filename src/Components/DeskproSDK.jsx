import React from 'react';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import { UIEvents, UIConstants } from '@deskproapps/deskproapps-sdk-core';
import { Container, Heading, Icon, Alert, Loader, DrawerList, Drawer } from 'deskpro-components';
import { buildConnectedProps, dpappPropType, storePropType } from '../utils/props';
import * as sdkActions from '../actions/sdkActions';
import Route from '../utils/route';
import WaitSync from '../utils/wait';
import AppIcon from './AppIcon';

/**
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
 *    <DeskproSDK name="My App" dpapp={dpapp} store={store}>
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
     * The name of the application.
     */
    name:     PropTypes.string.isRequired,
    /**
     * Instance of sdk-core.
     */
    dpapp:    dpappPropType.isRequired,
    /**
     * Instance of the redux store.
     */
    store:    storePropType.isRequired,
    /**
     * The sdk values stored in the store.
     */
    sdk:      PropTypes.object.isRequired,
    /**
     * The redux dispatch function.
     */
    dispatch: PropTypes.func.isRequired,
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
    const { dispatch, store } = this.props;

    return {
      dpapp: this.props.dpapp,
      route: new Route(dispatch, store.getState().sdk.route),
      store
    };
  }

  /**
   * Invoked immediately before mounting occurs
   */
  componentDidMount = () => {
    const sync = new WaitSync(() => {
      this.props.dispatch(sdkActions.ready());
    });

    this.bootstrapMe(sync);
    this.bootstrapTabData(sync);
    this.bootstrapStorage(sync);
    sync.resolve();
  };

  /**
   * Fetches the "me" data for the user
   *
   * @param {WaitSync} sync
   */
  bootstrapMe = (sync) => {
    const { dpapp, dispatch } = this.props;

    sync.incr();
    dpapp.restApi.get('/me')
      .then((resp) => {
        sync.decr();
        return dispatch(sdkActions.me(resp.body.data.person));
      })
      .catch((error) => {
        sync.decr();
        dispatch(sdkActions.error(error));
      });
  };

  /**
   * Fetches the data for the current tab
   *
   * @param {WaitSync} sync
   */
  bootstrapTabData = (sync) => {
    const { dpapp, dispatch } = this.props;

    sync.incr();
    dpapp.context.getTabData()
      .then((resp) => {
        sync.decr();
        return dispatch(sdkActions.tabData(resp.api_data));
      })
      .catch((error) => {
        sync.decr();
        dispatch(sdkActions.error(error));
      });
  };

  /**
   * Fetches the manifest storage values
   *
   * @param {WaitSync} sync
   */
  bootstrapStorage = (sync) => {
    const { dpapp, dispatch } = this.props;

    if (dpapp.manifest.storage && dpapp.manifest.storage.length > 0) {
      const appKeys    = [];
      const entityKeys = [];
      dpapp.manifest.storage.forEach((item) => {
        if (item.name.indexOf('entity:') === 0) {
          entityKeys.push(item.name.replace('entity:', ''));
        } else {
          appKeys.push(item.name.replace('app:', ''));
        }
      });
      if (appKeys.length > 0) {
        sync.incr();
        dispatch(sdkActions.appGetStorage(appKeys, sync.decr));
      }
      if (entityKeys.length > 0) {
        sync.incr();
        dispatch(sdkActions.entityGetStorage(entityKeys, sync.decr));
      }
    }
  };

  /**
   * Renders the list of errors as Alert components
   *
   * @returns {Array}
   */
  renderErrors() {
    return this.props.sdk.errors.map(error => (
      <Alert key={error.id} type="danger" style={{ margin: 10 }}>
        {error.msg}
      </Alert>
    ));
  }

  /**
   * Renders the app menu heading
   *
   * @returns {*}
   */
  renderHeading = () => {
    const { dpapp, name } = this.props;

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
        {name}
      </Heading>
    );
  };

  /**
   * @returns {XML}
   */
  render() {
    const { sdk, children } = this.props;

    if (!sdk.ready) {
      return (
        <Container className="up-text-center">
          {this.renderErrors()}
          <Loader />
        </Container>
      );
    }

    return (
      <DrawerList>
        <Drawer className="dp-column-drawer--with-controls">
          {this.renderHeading()}
          <Container style={{ padding: 0 }}>
            {this.renderErrors()}
            {React.cloneElement(
              React.Children.only(children),
              buildConnectedProps(this.props)
            )}
          </Container>
        </Drawer>
      </DrawerList>
    );
  }
}

/**
 * Wraps the DeskproSDK component in a redux Provider
 *
 * @param {React.Component} WrappedComponent
 * @returns {React.Component}
 */
const provider = (WrappedComponent) => {
  return class extends React.Component {
    static propTypes = {
      store: PropTypes.object.isRequired
    };

    render() {
      return (
        <Provider store={this.props.store}>
          <WrappedComponent {...this.props} />
        </Provider>
      );
    }
  };
};

/**
 * Maps redux state to component props
 *
 * @param {*} state
 * @returns {{sdk, form}}
 */
function mapStateToProps(state) {
  return {
    sdk:  Object.assign({}, state.sdk),
    form: Object.assign({}, state.form)
  };
}

export default connect(mapStateToProps)(provider(DeskproSDK));
