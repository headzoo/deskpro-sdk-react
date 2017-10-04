/**
 *
 */
export default class WaitSync {
  /**
   * Constructor
   *
   * @param {Function} cb
   */
  constructor(cb) {
    this.cb      = cb;
    this.counter = 0;
  }

  /**
   *
   */
  reset = () => {
    this.counter = 0;
  };

  /**
   *
   * @returns {number}
   */
  incr = () => {
    this.counter += 1;
    return this.counter;
  };

  /**
   *
   * @returns {number}
   */
  decr = () => {
    this.counter -= 1;
    if (this.counter < 1) {
      this.cb();
      this.reset();
    }

    return this.counter;
  };

  /**
   *
   */
  resolve = () => {
    if (this.counter < 1) {
      this.cb();
    }
  };
}
