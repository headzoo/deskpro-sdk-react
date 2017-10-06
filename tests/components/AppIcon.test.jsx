import React from 'react';
import renderer from 'react-test-renderer';
import AppIcon from '../../src/components/AppIcon';

it('AppIcon renders a badge', () => {
  const renderedValue = renderer.create(
    <AppIcon badgeCount={3} badgeVisible />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});

it('AppIcon hides the badge', () => {
  const renderedValue = renderer.create(
    <AppIcon badgeCount={3} badgeVisible={false} />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});
