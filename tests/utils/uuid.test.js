import { nextUUID } from '../../src/utils/uuid';

test('successfully generates successive UUIDs', () => {
  for (let i = 1; i < 5; i += 1) {
    expect(nextUUID()).toEqual(i);
  }
});
