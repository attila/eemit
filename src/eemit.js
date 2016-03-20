/**
 * Eemit Event Emitter
 *
 * @module Eemit
 * @param {object|function} target Target to decorate with event
 *   emitting capabilities. Can be a simple object, an instantiated class or a
 *   constructor function. Returns a
 * @returns {function} Factory function or extended constructor depending on the
 *   argument.
 */
export default target => {
  let eemit;
  let compound;

  const isObject = value => value === Object(value);
  const isFunction = value => typeof value === 'function';

  if (isFunction(target)) {
    /**
     * Class representing an event emitter.
     */
    class Eemit extends target {
      /**
       * Create an event emitter.
       */
      constructor(...args) {
        super(...args);
        this._eemitEvents = {};
      }
    }

    eemit = Eemit.prototype;
    compound = Eemit;
  } else if (isObject(target) || typeof target === 'undefined') {
    eemit = target || {};
    eemit._eemitEvents = {};
    compound = eemit;
  } else {
    throw new TypeError('Eemit can only be composed with objects or functions');
  }

  /**
   * Attach event handler
   *
   * @param {string} name Name of event
   * @param {function} callback Event handler to attach
   * @returns {object|function} Returns itself
   */
  eemit.on = function on(name, callback) {
    if (!callback || !isFunction(callback)) {
      throw new TypeError('Callback must be a function');
    }

    this._eemitEvents[name] = this._eemitEvents[name] || [];
    this._eemitEvents[name].push(callback);

    return this;
  };

  /**
   * Detach event handler
   *
   * @param {string} name Name of event
   * @param {function} callback Event handler to remove. Removes all handlers
   *   from the event When omitted
   *   all handlers
   * @returns {object|function} Returns itself
   */
  eemit.off = function off(name, callback) {
    if (callback) {
      if (!isFunction(callback)) {
        throw new TypeError('Callback must be a function');
      }
      this._eemitEvents[name].splice(this._eemitEvents[name].indexOf(callback), 1);
    } else {
      delete this._eemitEvents[name];
    }

    return this;
  };

  /**
   * Attach handler to be fired only once
   *
   * @param {string} name Name of event
   * @param {function} callback Event handler to attach
   * @returns {object|function} Returns itself
   */
  eemit.once = function once(name, callback) {
    callback._eemitOnce = true;
    this.on(name, callback);

    return this;
  };

  /**
   * Trigger events
   *
   * @param {string} name Name of event
   * @param {arguments} args The remainder of arguments. Any arguments given
   *   here are passed along to the handler.
   * @returns {object|function} Returns itself
   */
  eemit.trigger = function trigger(name, ...args) {
    const cached = (this._eemitEvents[name] && this._eemitEvents[name].slice()) || [];

    cached.forEach(callback => {
      // Detach handlers marked to run only once.
      if (callback._eemitOnce) {
        this.off(name, callback);
      }

      callback.apply(this, args);
    });

    return this;
  };

  return compound;
};
