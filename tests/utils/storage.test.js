import Storage from '../../src/utils/storage';

test('Storage creates app and entity properties', () => {
  const dispatch = jest.fn();
  const data     = {
    app: {
      foo: 'bar'
    },
    entity: {
      baz: 'bee'
    }
  };
  const storage = new Storage(dispatch, data);

  expect(storage.app.foo).toEqual(data.app.foo);
  expect(storage.entity.baz).toEqual(data.entity.baz);
});

test('Storage dispatches writes and reads', () => {
  const dispatch = jest.fn();
  const data     = {
    app: {
      foo: 'bar'
    },
    entity: {
      baz: 'bee'
    }
  };
  const storage = new Storage(dispatch, data);
  storage.setApp({ foo: 'bar' });
  storage.getApp('foo');
  storage.setEntity({ foo: 'bar' });
  storage.getEntity('foo');

  expect(dispatch).toHaveBeenCalledTimes(4);
});

