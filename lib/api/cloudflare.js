const axios = require('axios');

const required = require('../helpers/required');

const CLOUDFLARE_TOKEN = process.env.HRCD_CLOUDFLARE_TOKEN
  || process.env.CLOUDFLARE_TOKEN
  || required('HRCD_CLOUDFLARE_TOKEN | CLOUDFLARE_TOKEN');

const CLOUDFLARE_ZONE_ID = process.env.HRCD_CLOUDFLARE_ZONE_ID
  || process.env.CLOUDFLARE_ZONE_ID
  || required('HRCD_CLOUDFLARE_ZONE_ID | CLOUDFLARE_ZONE_ID');

const api = axios.create({
  baseURL: `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}`,
  headers: {
    Authorization: `Bearer ${CLOUDFLARE_TOKEN}`,
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
