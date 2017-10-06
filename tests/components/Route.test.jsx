import React from 'react';
import renderer from 'react-test-renderer';
import Route from '../../src/components/Route';

it('Route renders its component', () => {
  const App = () => <div>Hello</div>;
  const renderedValue = renderer.create(
    <Route location="index" component={App} />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});
