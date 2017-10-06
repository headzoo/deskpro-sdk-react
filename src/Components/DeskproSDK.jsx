import React from 'react';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import { UIEvents, UIConstants } from '@deskproapps/deskproapps-sdk-core';
import { Container, Heading, Icon, Alert, Loader, DrawerList, Drawer } from 'deskpro-components';
import { buildConnectedProps, dpappPropType, storePropType } from '../utils/props';
import * as sdkActions from '../actions/sdkActions';
import Route from '../utils/route';
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
    const promises = [
      this.bootstrapMe(),
      this.bootstrapTabData(),
      ...this.bootstrapStorage()
    ];
    Promise.all(promises)
      .then(() => {
        return this.props.dispatch(sdkActions.ready());
      }).catch((error) => {
        return this.props.dispatch(sdkActions.error(error));
      });
  };

  /**
   * Fetches the "me" data for the user
   *
   * @returns {Promise}
   */
  bootstrapMe = () => {
    return this.props.dpapp.restApi.get('/me')
      .then((resp) => {
        try {
          return Promise.resolve(
            this.props.dispatch(sdkActions.me(resp.body.data.person))
          );
        } catch (e) {
          console.warn(e); // eslint-disable-line no-console
          return Promise.resolve({});
        }
      });
  };

  /**
   * Fetches the data for the current tab
   *
   * @returns {Promise}
   */
  bootstrapTabData = () => {
    return this.props.dpapp.context.getTabData()
      .then((resp) => {
        try {
          return Promise.resolve(
            this.props.dispatch(sdkActions.tabData(resp.api_data))
          );
        } catch (e) {
          console.warn(e); // eslint-disable-line no-console
          return Promise.resolve({});
        }
      });
  };

  /**
   * Fetches the manifest storage values
   *
   * @returns {Promise[]}
   */
  bootstrapStorage = () => {
    const { dpapp, dispatch } = this.props;

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
        promises.push(
          dispatch(sdkActions.appGetStorage(appKeys))
        );
      }
      if (entityKeys.length > 0) {
        promises.push(
          dispatch(sdkActions.entityGetStorage(entityKeys))
        );
      }
      oauthKeys.forEach((key) => {
        promises.push(
          dispatch(sdkActions.oauthGetSettings(key))
        );
      });
    }

    return promises;
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
