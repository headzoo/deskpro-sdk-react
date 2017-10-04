import WaitSync from '../../src/utils/wait';

test('calls callback when counter reaches 0', () => {
  let called = false;
  const sync = new WaitSync(() => {
    called = true;
  });

  for (let i = 1; i < 5; i += 1) {
    expect(sync.incr()).toEqual(i);
  }
  expect(sync.counter).toEqual(4);
  expect(called).toEqual(false);

  for (let i = 3; i >= 0; i -= 1) {
    expect(sync.decr()).toEqual(i);
  }
  expect(sync.counter).toEqual(0);
  expect(called).toEqual(true);
});
