import { appSetStorage, appGetStorage, entitySetStorage, entityGetStorage } from '../actions/sdkActions';
import { isPlainObj } from './object';

/**
 * Returns the values from the given form element
 *
 * @param {*} form
 * @returns {{}}
 */
function getFormValues(form) {
  const values   = {};
  const elements = form.elements;
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].name) {
      values[elements[i].name] = elements[i].value;
    }
  }

  return values;
}

/**
 *
 */
export default class Storage {
  /**
   * Constructor
   *
   * @param {Function} dispatch
   * @param {*} values
   */
  constructor(dispatch, values) {
    this.dispatch = dispatch;
    this.setValues(values);
  }

  /**
   * @param {*} values
   */
  setValues = (values) => {
    this.app      = {};
    this.entity   = {};

    const storageValues = Object.assign({}, values);
    Object.keys(storageValues.app).forEach((key) => {
      Object.defineProperty(this.app, key, {
        value:        storageValues.app[key],
        configurable: false,
        writable:     false
      });
    });
    Object.keys(storageValues.entity).forEach((key) => {
      Object.defineProperty(this.entity, key, {
        value:        storageValues.entity[key],
        configurable: false,
        writable:     false
      });
    });
  };

  /**
   * @param {string} key
   * @param {*} defaultValue
   */
  getApp = (key, defaultValue = null) => {
    this.dispatch(appGetStorage(key, defaultValue));
  };

  /**
   * @param {*} values
   * @param {Function} [cb]
   */
  setApp = (values, cb = () => {}) => {
    this.dispatch(appSetStorage(values, null, cb));
  };

  /**
   * @param {string} key
   * @param {*} defaultValue
   */
  getEntity = (key, defaultValue = null) => {
    this.dispatch(entityGetStorage(key, defaultValue));
  };

  /**
   * @param {*} values
   * @param {Function} [cb]
   */
  setEntity = (values, cb = () => {}) => {
    this.dispatch(entitySetStorage(values, null, cb));
  };

  /**
   * Returns a form submit handler which saves the form values in app storage
   *
   * Example:
   *
   * ```jsx
   * <Form
   *  name="settings"
   *  onSubmit={storage.onSubmitApp}
   * >
   *  <Input
   *    label="Client Secret"
   *    id="clientSecret"
   *    name="clientSecret"
   *  />
   * </Form>
   * ```
   *
   * A function may be given which will be called with the form values after they have
   * been saved to storage.
   *
   * Example:
   *
   * ```jsx
   * <Form
   *  name="settings"
   *  onSubmit={storage.onSubmitApp(this.handleSubmit)}
   * >
   *  <Input
   *    label="Client Secret"
   *    id="clientSecret"
   *    name="clientSecret"
   *  />
   * </Form>
   * ```
   *
   * @param {Function} [cb]
   * @param {*} [e]
   * @param {*} [f]
   * @returns {Function}
   */
  onSubmitApp = (cb, e, f) => {
    if (typeof cb === 'function') {
      return (values, event, form) => {
        return this.handleForm(this.setApp, cb, values, form);
      };
    }
    return this.handleForm(this.setApp, () => {}, cb, f);
  };

  /**
   * Returns a form submit handler which saves the form values in entity storage
   *
   * Example:
   *
   * ```jsx
   * <Form
   *  name="settings"
   *  onSubmit={storage.onSubmitEntity}
   * >
   *  <Input
   *    label="Client Secret"
   *    id="clientSecret"
   *    name="clientSecret"
   *  />
   * </Form>
   * ```
   *
   * A function may be given which will be called with the form values after they have
   * been saved to storage.
   *
   * Example:
   *
   * ```jsx
   * <Form
   *  name="settings"
   *  onSubmit={storage.onSubmitEntity(this.handleSubmit)}
   * >
   *  <Input
   *    label="Client Secret"
   *    id="clientSecret"
   *    name="clientSecret"
   *  />
   * </Form>
   * ```
   *
   * @param {Function} [cb]
   * @param {*} [e]
   * @param {*} [f]
   * @returns {Function}
   */
  onSubmitEntity = (cb, e, f) => {
    if (typeof cb === 'function') {
      return (values, event, form) => {
        return this.handleForm(this.setEntity, cb, values, form);
      };
    }
    return this.handleForm(this.setEntity, () => {}, cb, f);
  };

  /**
   * @param {Function} func
   * @param {Function} cb
   * @param {object} values
   * @param {object} form
   * @returns {*}
   */
  handleForm = (func, cb, values, form) => {
    let formName;
    let formValues;

    if (typeof values === 'object' && values.target && values.target.nodeName === 'FORM') {
      values.preventDefault();
      formName = values.target.getAttribute('name');
      if (!formName) {
        throw new Error('Form submitted without "name" attribute.');
      }
      formValues = getFormValues(values.target);
    } else if (isPlainObj(values) && typeof form === 'object' && form.form !== undefined) {
      formName   = form.form || form.name;
      formValues = values;
    }

    if (formName) {
      return func.call(this, {
        [formName]: formValues
      }, () => {
        cb(formValues);
      });
    }

    throw new Error('Unable to handle submitted form.');
  };
}
