const axios = require('axios');

const required = require('../helpers/required');
const base64 = require('../helpers/base64');

const HRCD_CLOUDFLARE_TOKEN_B64 = process.env.HRCD_CLOUDFLARE_TOKEN_B64 || required('HRCD_CLOUDFLARE_TOKEN_B64');
const HRCD_CLOUDFLARE_ZONE_ID = process.env.HRCD_CLOUDFLARE_ZONE_ID || required('HRCD_CLOUDFLARE_ZONE_ID');

const api = axios.create({
  baseURL: `https://api.cloudflare.com/client/v4/zones/${HRCD_CLOUDFLARE_ZONE_ID}`,
  headers: {
    Authorization: `Bearer ${base64.decode(HRCD_CLOUDFLARE_TOKEN_B64)}`,
  },
});

module.exports = {
  getDnsRecords: (id = '') => api
    .get(`dns_records/${id}`)
    .catch((e) => { throw e; }),
  createDnsRecord: (name = required('name'), content = required('content')) => api
    .post('dns_records', {
      name,
      content,
      type: 'CNAME',
      proxied: true,
    })
    .catch((e) => { throw e; }),
  deleteDnsRecord: (id = required('id')) => api
    .delete(`dns_records/${id}`)
    .catch((e) => { throw e; }),
};
