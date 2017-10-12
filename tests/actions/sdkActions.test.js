import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as types from '../../src/actions/actionTypes';
import * as sdkActions from '../../src/actions/sdkActions';

test('sdkActions.createBatchStorage', () => {
  const obj = { foo: 'bar', baz: 'bee' };
  const expected = [
    ['foo', 'bar'],
    ['baz', 'bee']
  ];

  expect(sdkActions.createBatchStorage(obj)).toEqual(expected);
});

test('sdkActions.ready', () => {
  const expectedAction = {
    type:  types.SDK_READY,
    ready: true
  };
  expect(sdkActions.ready()).toEqual(expectedAction);
});

test('sdkActions.refreshing', () => {
  const expectedAction = {
    type:       types.SDK_REFRESHING,
    refreshing: true
  };
  expect(sdkActions.refreshing()).toEqual(expectedAction);
});

test('sdkActions.loading', () => {
  const expectedAction = {
    type:    types.SDK_LOADING,
    loading: true
  };
  expect(sdkActions.loading()).toEqual(expectedAction);
});

test('sdkActions.collapsed', () => {
  const expectedAction = {
    type:      types.SDK_COLLAPSED,
    collapsed: true
  };
  expect(sdkActions.collapsed()).toEqual(expectedAction);
});

test('sdkActions.clearErrors', () => {
  const expectedAction = {
    type: types.SDK_CLEAR_ERRORS
  };

  expect(sdkActions.clearErrors()).toEqual(expectedAction);
});

test('sdkActions.me', () => {
  const data = {};
  const expectedAction = {
    type: types.SDK_ME,
    data
  };

  expect(sdkActions.me(data)).toEqual(expectedAction);
});

test('sdkActions.tabData', () => {
  const data = {};
  const expectedAction = {
    type: types.SDK_TAB_DATA,
    data
  };

  expect(sdkActions.tabData(data)).toEqual(expectedAction);
});

test('sdkActions.toRoute', () => {
  const location = 'testing';
  const params   = {};
  const expectedAction = {
    type: types.SDK_TO_ROUTE,
    location,
    params
  };

  expect(sdkActions.toRoute(location, params)).toEqual(expectedAction);
});

test('sdkActions.appValue', () => {
  const key   = 'testing';
  const value = {};
  const expectedAction = {
    type: types.SDK_APP_VALUE,
    key,
    value
  };

  expect(sdkActions.appValue(key, value)).toEqual(expectedAction);
});

test('sdkActions.entityValue', () => {
  const key   = 'testing';
  const value = {};
  const expectedAction = {
    type: types.SDK_ENTITY_VALUE,
    key,
    value
  };

  expect(sdkActions.entityValue(key, value)).toEqual(expectedAction);
});

test('sdkActions.oauthProvider', () => {
  const provider = 'testing';
  const settings = {};
  const expectedAction = {
    type: types.SDK_OAUTH_PROVIDER,
    provider,
    settings
  };

  expect(sdkActions.oauthProvider(provider, settings)).toEqual(expectedAction);
});

// ---------------------
// --- async actions ---
// ---------------------

const dpapp = {
  storage: {
    setAppStorage:    jest.fn().mockReturnValue(Promise.resolve()),
    getAppStorage:    jest.fn().mockReturnValue(Promise.resolve('bar')),
    setEntityStorage: jest.fn().mockReturnValue(Promise.resolve()),
    getEntityStorage: jest.fn().mockReturnValue(Promise.resolve('bar'))
  },
  oauth: {
    settings: jest.fn().mockReturnValue(Promise.resolve({}))
  }
};
const middlewares = [thunk.withExtraArgument(dpapp)];
const mockStore = configureMockStore(middlewares);

test('sdkActions.appSetStorage', () => {
  const store = mockStore({});
  dpapp.storage.setAppStorage.mockClear();

  const key = { foo: 'bar' };
  const expectedActions = [
    {
      type: types.SDK_APP_VALUE,
      key
    }
  ];

  return store.dispatch(sdkActions.appSetStorage(key))
    .then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      expect(dpapp.storage.setAppStorage).toHaveBeenCalled();
    });
});

test('sdkActions.appGetStorage', () => {
  const store = mockStore({});
  dpapp.storage.getAppStorage.mockClear();

  const key   = 'foo';
  const value = 'bar';
  const expectedActions = [
    {
      type: types.SDK_APP_VALUE,
      key,
      value
    }
  ];

  return store.dispatch(sdkActions.appGetStorage(key, value))
    .then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      expect(dpapp.storage.getAppStorage).toHaveBeenCalled();
    });
});

test('sdkActions.entitySetStorage', () => {
  const store = mockStore({});
  dpapp.storage.setEntityStorage.mockClear();

  const key = { foo: 'bar' };
  const expectedActions = [
    {
      type: types.SDK_ENTITY_VALUE,
      key
    }
  ];

  return store.dispatch(sdkActions.entitySetStorage(key))
    .then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      expect(dpapp.storage.setEntityStorage).toHaveBeenCalled();
    });
});

test('sdkActions.entityGetStorage', () => {
  const store = mockStore({});
  dpapp.storage.getEntityStorage.mockClear();

  const key   = 'foo';
  const value = 'bar';
  const expectedActions = [
    {
      type: types.SDK_ENTITY_VALUE,
      key,
      value
    }
  ];

  return store.dispatch(sdkActions.entityGetStorage(key, value))
    .then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      expect(dpapp.storage.getEntityStorage).toHaveBeenCalled();
    });
});

test('sdkActions.oauthGetSettings', () => {
  const store = mockStore({});
  dpapp.oauth.settings.mockClear();

  const provider = 'foo';
  const settings = {};
  const expectedActions = [
    {
      type: types.SDK_OAUTH_PROVIDER,
      provider,
      settings
    }
  ];

  return store.dispatch(sdkActions.oauthGetSettings(provider))
    .then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      expect(dpapp.oauth.settings).toHaveBeenCalled();
    });
});
