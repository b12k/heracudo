const axios = require('axios');

const required = require('../helpers/required');

const HEROKU_TOKEN = process.env.HRCD_HEROKU_TOKEN
  || process.env.HEROKU_TOKEN
  || required('HRCD_HEROKU_TOKEN | HEROKU_TOKEN');
const HEROKU_APP_NAME = process.env.HEROKU_APP_NAME || required('HEROKU_APP_NAME');

const api = axios.create({
  baseURL: 'https://api.heroku.com/',
  headers: {
    Authorization: `Bearer ${HEROKU_TOKEN}`,
    Accept: 'application/vnd.heroku+json; version=3',
  },
});

module.exports = {
  getDomains: (hostname = '') => api
    .get(`apps/${HEROKU_APP_NAME}/domains/${hostname}`)
    .catch((e) => { throw e; }),
  createDomain: (hostname = required('hostname')) => api
    .post(`apps/${HEROKU_APP_NAME}/domains`, { hostname, sni_endpoint: null })
    .catch((e) => { throw e; }),
  deleteDomain: (hostname = required('hostname')) => api
    .delete(`apps/${HEROKU_APP_NAME}/domains/${hostname}`)
    .catch((e) => { throw e; }),
};
