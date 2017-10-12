import UI from '../../src/utils/ui';
import * as types from '../../src/actions/actionTypes';

test('UI creates self properties', () => {
  const dispatch = jest.fn();
  const values   = {
    loading:    false,
    refreshing: false,
    badgeCount: 0
  };
  const ui = new UI(dispatch, values);

  expect(ui.loading).toEqual(values.loading);
  expect(ui.refreshing).toEqual(values.refreshing);
  expect(ui.badgeCount).toEqual(values.badgeCount);
});

test('UI enters loading state', () => {
  const dispatch = jest.fn();
  const values   = {
    loading:    false,
    refreshing: false,
    badgeCount: 0
  };
  const ui = new UI(dispatch, values);
  ui.setLoading(true);

  expect(dispatch).toBeCalledWith({
    type:    types.SDK_LOADING,
    loading: true
  });
});

