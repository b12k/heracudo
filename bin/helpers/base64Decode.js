"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = string => Buffer.from(string, 'base64').toString('binary');

exports.default = _default;