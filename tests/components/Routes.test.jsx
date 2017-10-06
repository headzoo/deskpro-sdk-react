import React from 'react';
import renderer from 'react-test-renderer';
import Routes from '../../src/components/Routes';
import Route from '../../src/components/Route';

it('Routes renders the matching component', () => {
  const Page1 = () => <div>Page1</div>;
  const Page2 = () => <div>Page2</div>;

  const renderedValue = renderer.create(
    <Routes to="page2">
      <Route location="page1" component={Page1} />
      <Route location="page2" component={Page2} />
    </Routes>
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});

it('Routes renders the defaultRoute', () => {
  const Page1 = () => <div>Page1</div>;
  const Page2 = () => <div>Page2</div>;

  const renderedValue = renderer.create(
    <Routes to="page3">
      <Route defaultRoute component={Page1} />
      <Route location="page2" component={Page2} />
    </Routes>
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});
