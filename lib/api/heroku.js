const axios = require('axios');

const required = require('../helpers/required');
const base64 = require('../helpers/base64');

const HRCD_HEROKU_TOKEN_B64 = process.env.HRCD_HEROKU_TOKEN_B64 || required('HRCD_HEROKU_TOKEN_B64');
const HEROKU_APP_NAME = process.env.HEROKU_APP_NAME || required('HEROKU_APP_NAME');

const api = axios.create({
  baseURL: 'https://api.heroku.com/',
  headers: {
    Authorization: `Bearer ${base64.decode(HRCD_HEROKU_TOKEN_B64)}`,
    Accept: 'application/vnd.heroku+json; version=3',
  },
});

module.exports = {
  getDomains: (hostname = '') => api.get(`apps/${HEROKU_APP_NAME}/domains/${hostname}`),
  createDomain: (hostname = required('hostname')) => api.post(`apps/${HEROKU_APP_NAME}/domains`, { hostname }),
  deleteDomain: (hostname = required('hostname')) => api.delete(`apps/${HEROKU_APP_NAME}/domains/${hostname}`),
};
