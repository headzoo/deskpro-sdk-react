import { isPlainObj } from '../../src/utils/object';

class TestClass {}

test('isPlainObj', () => {
  expect(isPlainObj({ foo: 'bar' })).toBe(true);
  expect(isPlainObj(isPlainObj)).toBe(false);
  expect(isPlainObj(new TestClass())).toBe(false);
});
