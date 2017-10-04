import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { buildConnectedProps, dpappPropType } from './props';

/**
 * Provides the wrapped component with the dpapp context
 *
 * @param {React.Component} WrappedComponent
 * @returns {React.Component}
 */
const dpappProvider = (WrappedComponent) => {
  return class extends React.Component {
    static propTypes = {
      /**
       * Form values stored in the store.
       */
      form:     PropTypes.object.isRequired,
      /**
       * Redux dispatcher.
       */
      dispatch: PropTypes.func.isRequired
    };

    static contextTypes = {
      dpapp: dpappPropType,
      store: PropTypes.object
    };

    render() {
      const connectedProps = Object.assign({}, this.props, this.context);

      return (
        <WrappedComponent
          {...buildConnectedProps(connectedProps)}
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
 * @param {React.Component} WrappedComponent
 * @param {Function} [mapStateToProps]
 * @returns {React.Component}
 */
export const sdkConnect = (WrappedComponent, mapStateToProps) => {
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

  return connect(mapper)(dpappProvider(WrappedComponent));
};
