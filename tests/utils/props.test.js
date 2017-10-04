import PropTypes from 'prop-types';
import { propKeyFilter } from '../../src/utils/props';

test('propKeyFilter filters props', () => {
  const propTypes = {
    className: PropTypes.string
  };
  const props = {
    className: 'dp-item',
    title:     'foo'
  };
  const result = propKeyFilter(props, propTypes);
  expect(result.className).toBe(undefined);
  expect(result.title).not.toBe(undefined);
});
