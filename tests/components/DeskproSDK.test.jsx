import React from 'react';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import initialState from '../../src/store/initialState';
import DeskproSDK from '../../src/components/DeskproSDK';

const mockStore = configureMockStore();
const dpapp = {
  context: {
    getTabData: () => Promise.resolve()
  },
  oauth:   {},
  ui:      {},
  restApi: {
    get: () => Promise.resolve()
  },
  manifest: {
    storage: []
  }
};

it('DeskproSDK renders the wrapped component', () => {
  const App = () => <div>App</div>;
  const store = mockStore(initialState);
  const renderedValue = renderer.create(
    <DeskproSDK dpapp={dpapp} store={store}>
      <App />
    </DeskproSDK>
  ).toJSON();

  expect(renderedValue).toMatchSnapshot();
});
