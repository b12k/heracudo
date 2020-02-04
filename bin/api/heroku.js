"use strict";

var _axios = _interopRequireDefault(require("axios"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  env: {
    HEROKU_TOKEN = (0, _helpers.required)('HEROKU_TOKEN'),
    HEROKU_APP_NAME = (0, _helpers.required)('HEROKU_APP_NAME')
  }
} = process;

const api = _axios.default.create({
  baseURL: 'https://api.heroku.com/',
  headers: {
    Authorization: `Bearer ${HEROKU_TOKEN}`,
    Accept: 'application/vnd.heroku+json; version=3'
  }
});

module.exports = {
  getDomains: (hostname = '') => api.get(`apps/${HEROKU_APP_NAME}/domains/${hostname}`),
  createDomain: (hostname = (0, _helpers.required)('hostname')) => api.post(`apps/${HEROKU_APP_NAME}/domains`, {
    hostname
  }),
  deleteDomain: (hostname = (0, _helpers.required)('hostname')) => api.delete(`apps/${HEROKU_APP_NAME}/domains/${hostname}`)
};