"use strict";

var _axios = _interopRequireDefault(require("axios"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  env: {
    CLOUDFLARE_TOKEN = (0, _helpers.required)('CLOUDFLARE_TOKEN'),
    CLOUDFLARE_ZONE_ID = (0, _helpers.required)('CLOUDFLARE_ZONE_ID')
  }
} = process;

const api = _axios.default.create({
  baseURL: `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}`,
  headers: {
    Authorization: `Bearer ${CLOUDFLARE_TOKEN}`
  }
});

module.exports = {
  getDnsRecords: (id = '') => api.get(`dns_records/${id}`),
  createDnsRecord: (name = (0, _helpers.required)('name'), content = (0, _helpers.required)('content')) => api.post('dns_records', {
    name,
    content,
    type: 'CNAME',
    proxied: true
  }),
  deleteDnsRecord: (id = (0, _helpers.required)('id')) => api.delete(`dns_records/${id}`)
};