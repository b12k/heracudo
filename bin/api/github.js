"use strict";

var _axios = _interopRequireDefault(require("axios"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  env: {
    GITHUB_REPOSITORY = (0, _helpers.required)('GITHUB_REPOSITORY'),
    GITHUB_TOKEN = (0, _helpers.required)('GITHUB_TOKEN'),
    HEROKU_PR_NUMBER = (0, _helpers.required)('HEROKU_PR_NUMBER'),
    GITHUB_PR_LINK_MARKER = '### Preview:'
  }
} = process;

const api = _axios.default.create({
  baseURL: 'https://api.github.com/',
  headers: {
    Authorization: `token ${(0, _helpers.base64Decode)(GITHUB_TOKEN)}`,
    Accept: 'application/vnd.github.v3+json'
  }
});

const prUrl = `repos/${GITHUB_REPOSITORY}/pulls/${HEROKU_PR_NUMBER}`;
const splitter = '\r\n';

const getPrBody = () => api.get(prUrl).then(({
  data: {
    body
  }
}) => body);

const setPrBody = body => api.patch(prUrl, {
  body
});

const createPrLink = async (hostname = (0, _helpers.required)('hostname')) => setPrBody([`${GITHUB_PR_LINK_MARKER} [${hostname}](${hostname})`, await getPrBody()].join(splitter));

const deletePrLink = async () => {
  const prBody = await getPrBody();
  const lineRegExp = new RegExp(`^${GITHUB_PR_LINK_MARKER}`);
  const newPrBody = prBody.split(splitter).filter(line => !line.match(lineRegExp)).join(splitter);
  return setPrBody(newPrBody);
};

module.exports = {
  createPrLink,
  deletePrLink
};