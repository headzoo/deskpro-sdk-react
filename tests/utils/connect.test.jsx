import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import * as connect from '../../src/utils/connect';
import Storage from '../../src/utils/storage';
import Route from '../../src/utils/route';
import UI from '../../src/utils/ui';

configure({ adapter: new Adapter() });

const oauth    = {};
const context  = {};
const route    = {};
const tabData  = {};
const me       = {};
const ui       = {};
const dispatch = () => {};
const store    = {
  dispatch
};
const dpapp = {
  context,
  oauth,
  ui
};
const storage = {
  app:    {},
  entity: {}
};
const sdk = {
  oauth: {
    providers: {}
  },
  storage,
  route,
  tabData,
  me
};

const props = {
  store,
  dpapp,
  sdk
};

test('sdkProps correctly builds sdk props from initial props', () => {
  const expected = {
    oauth: Object.assign({}, oauth, { providers: {} }),
    dispatch,
    context,
    storage,
    tabData,
    route,
    dpapp,
    me,
    ui
  };
  expect(connect.sdkProps(props)).toMatchObject(expected);
});

test('dpappProvider passes props to the wrapped component', () => {
  const Wrapped = connect.dpappProvider(
    () => <div>Testing</div>
  );
  const app  = shallow(<Wrapped {...props} />, {
    context: { dpapp, store }
  });

  const expected = {
    dispatch,
    context,
    tabData,
    dpapp,
    me
  };
  Object.keys(expected).forEach((key) => {
    expect(app.prop(key)).toEqual(expected[key]);
  });
  expect(app.dive().text()).toEqual('Testing');
  expect(app.prop('storage')).toBeInstanceOf(Storage);
  expect(app.prop('route')).toBeInstanceOf(Route);
  expect(app.prop('ui')).toBeInstanceOf(UI);
});

test('sdkConnect to call the redux connect function', () => {
  const s = {
    getState:  jest.fn().mockReturnValue({}),
    subscribe: jest.fn(),
    dispatch
  };
  const Connected = connect.sdkConnect(
    () => <div>Testing</div>
  );
  const app = shallow(<Connected />, {
    context: { store: s }
  });

  const expected = {
    form: {},
    sdk:  {},
    dispatch
  };
  Object.keys(expected).forEach((key) => {
    expect(app.prop(key)).toEqual(expected[key]);
  });
  expect(s.getState).toHaveBeenCalled();
  expect(s.subscribe).toHaveBeenCalled();
});
