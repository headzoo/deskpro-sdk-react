import * as types from '../../src/actions/actionTypes';
import sdkReducer from '../../src/reducers/sdkReducer';
import initialState from '../../src/store/initialState';

const merge = obj => Object.assign({}, initialState.sdk, obj);

const data = [
  {
    action: {
      type:  types.SDK_READY,
      ready: true
    },
    expected: {
      ready: true
    }
  },
  {
    action: {
      type:       types.SDK_REFRESHING,
      refreshing: true
    },
    expected: {
      ui: {
        loading:    false,
        collapsed:  false,
        refreshing: true
      }
    }
  },
  {
    action: {
      type:    types.SDK_LOADING,
      loading: true
    },
    expected: {
      ui: {
        loading:    true,
        collapsed:  false,
        refreshing: false
      }
    }
  },
  {
    action: {
      type:      types.SDK_COLLAPSED,
      collapsed: true
    },
    expected: {
      ui: {
        loading:    false,
        collapsed:  true,
        refreshing: false
      }
    }
  },
  {
    action: {
      type:  types.SDK_ERROR,
      error: 'testing'
    },
    expected: {
      errors: [{ id: 1, msg: 'testing' }]
    }
  },
  {
    action: {
      type:  types.SDK_CLEAR_ERRORS,
      error: 'testing'
    },
    expected: {
      errors: []
    }
  },
  {
    action: {
      type: types.SDK_ME,
      data: { foo: 'bar' }
    },
    expected: {
      me: { foo: 'bar' }
    }
  },
  {
    action: {
      type: types.SDK_TAB_DATA,
      data: { foo: 'bar' }
    },
    expected: {
      tabData: { foo: 'bar' }
    }
  },
  {
    action: {
      type:     types.SDK_TO_ROUTE,
      location: 'testing',
      params:   { foo: 'bar' }
    },
    expected: {
      route: {
        location: 'testing',
        params:   { foo: 'bar' }
      }
    }
  },
  {
    action: {
      type:  types.SDK_APP_VALUE,
      key:   'testing',
      value: { foo: 'bar' }
    },
    expected: {
      storage: {
        app: {
          testing: { foo: 'bar' }
        },
        entity: {}
      }
    }
  },
  {
    action: {
      type:  types.SDK_ENTITY_VALUE,
      key:   'testing',
      value: { foo: 'bar' }
    },
    expected: {
      storage: {
        app:    {},
        entity: {
          testing: { foo: 'bar' }
        }
      }
    }
  },
  {
    action: {
      type:     types.SDK_OAUTH_PROVIDER,
      provider: 'testing',
      settings: { foo: 'bar' }
    },
    expected: {
      oauth: {
        providers: {
          testing: { foo: 'bar' }
        }
      }
    }
  }
];

describe('sdkReducer changes state in response to actions', () => {
  data.forEach((d) => {
    test(d.action.type, () => {
      const actual   = sdkReducer(initialState.sdk, d.action);
      const expected = merge(d.expected);
      expect(actual).toEqual(expected);
    });
  });
});

