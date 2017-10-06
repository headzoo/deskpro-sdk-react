import React from 'react';
import renderer from 'react-test-renderer';
import LinkButton from '../../src/components/LinkButton';

it('LinkButton renders a button', () => {
  const renderedValue = renderer.create(
    <LinkButton to="index">Index</LinkButton>
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});
