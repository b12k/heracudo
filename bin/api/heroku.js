const axios = require('axios');

const required = require('../helpers/required');

const HEROKU_TOKEN = process.env.HEROKU_TOKEN || required('HEROKU_TOKEN');
const HEROKU_APP_NAME = process.env.HEROKU_APP_NAME || required('HEROKU_APP_NAME');

const api = axios.create({
  baseURL: 'https://api.heroku.com/',
  headers: {
    Authorization: `Bearer ${HEROKU_TOKEN}`,
    Accept: 'application/vnd.heroku+json; version=3',
  },
});

module.exports = {
  getDomains: (hostname = '') => api.get(`apps/${HEROKU_APP_NAME}/domains/${hostname}`),
  createDomain: (hostname = required('hostname')) => api.post(`apps/${HEROKU_APP_NAME}/domains`, { hostname }),
  deleteDomain: (hostname = required('hostname')) => api.delete(`apps/${HEROKU_APP_NAME}/domains/${hostname}`),
};
