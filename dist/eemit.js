'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (target) {
  var eemit = void 0;
  var compound = void 0;

  var isObject = function isObject(value) {
    return value === Object(value);
  };
  var isFunction = function isFunction(value) {
    return typeof value === 'function';
  };

  if (isFunction(target)) {
    var Eemit = function (_target) {
      _inherits(Eemit, _target);

      function Eemit() {
        var _Object$getPrototypeO;

        _classCallCheck(this, Eemit);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Eemit)).call.apply(_Object$getPrototypeO, [this].concat(args)));

        _this._eemitEvents = {};
        return _this;
      }

      return Eemit;
    }(target);

    eemit = Eemit.prototype;
    compound = Eemit;
  } else if (isObject(target) || typeof target === 'undefined') {
    eemit = target || {};
    eemit._eemitEvents = {};
    compound = eemit;
  } else {
    throw new TypeError('Eemit can only be composed with objects or functions');
  }

  eemit.on = function on(name, callback) {
    if (!callback || !isFunction(callback)) {
      throw new TypeError('Callback must be a function');
    }

    this._eemitEvents[name] = this._eemitEvents[name] || [];
    this._eemitEvents[name].push(callback);

    return this;
  };

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

  eemit.once = function once(name, callback) {
    callback._eemitOnce = true;
    this.on(name, callback);

    return this;
  };

  eemit.trigger = function trigger(name) {
    var _this2 = this;

    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    var cached = this._eemitEvents[name] && this._eemitEvents[name].slice() || [];

    cached.forEach(function (callback) {
      if (callback._eemitOnce) {
        _this2.off(name, callback);
      }

      callback.apply(_this2, args);
    });

    return this;
  };

  return compound;
};

module.exports = exports['default'];

//# sourceMappingURL=eemit.js.map