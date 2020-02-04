"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "cloudflare", {
  enumerable: true,
  get: function () {
    return _cloudflare2.default;
  }
});
Object.defineProperty(exports, "heroku", {
  enumerable: true,
  get: function () {
    return _heroku2.default;
  }
});
Object.defineProperty(exports, "github", {
  enumerable: true,
  get: function () {
    return _github2.default;
  }
});

var _cloudflare2 = _interopRequireDefault(require("./cloudflare"));

var _heroku2 = _interopRequireDefault(require("./heroku"));

var _github2 = _interopRequireDefault(require("./github"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }