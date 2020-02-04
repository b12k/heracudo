"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = (name = '') => {
  const variable = name ? `"${name}"` : 'Variable';
  throw new SyntaxError(`${variable} required but not defined.`);
};

exports.default = _default;