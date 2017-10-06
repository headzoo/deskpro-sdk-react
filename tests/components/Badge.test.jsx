import React from 'react';
import renderer from 'react-test-renderer';
import Badge from '../../src/components/Badge';

it('Badge is visible', () => {
  const renderedValue = renderer.create(
    <Badge count={3} visible />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});

it('Badge is hidden', () => {
  const renderedValue = renderer.create(
    <Badge count={3} visible={false} />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});
