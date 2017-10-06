import React from 'react';
import renderer from 'react-test-renderer';
import Link from '../../src/components/Link';

it('Link renders anchor tag', () => {
  const renderedValue = renderer.create(
    <Link to="index">Index</Link>
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});
