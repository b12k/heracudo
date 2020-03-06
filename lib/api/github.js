const axios = require('axios');

const required = require('../helpers/required');

const GITHUB_REPOSITORY = process.env.HRCD_GITHUB_REPOSITORY
  || process.env.GITHUB_REPOSITORY
  || required('HRCD_GITHUB_REPOSITORY | GITHUB_REPOSITORY');
const GITHUB_TOKEN = process.env.HRCD_GITHUB_TOKEN
  || process.env.GITHUB_TOKEN
  || required('HRCD_GITHUB_TOKEN | GITHUB_TOKEN');
const HRCD_GITHUB_LINK_MARKER = process.env.HRCD_GITHUB_LINK_MARKER || '## Review App:';
const HRCD_GITHUB_LINK_PENDING = process.env.HRCD_GITHUB_LINK_PENDING || '⏳';
const HRCD_GITHUB_LINK_READY = process.env.HRCD_GITHUB_LINK_READY || '🚀';

const HEROKU_PR_NUMBER = process.env.HEROKU_PR_NUMBER || required('HEROKU_PR_NUMBER');

const prUrl = `repos/${GITHUB_REPOSITORY}/pulls/${HEROKU_PR_NUMBER}`;
const splitter = '\r\n';
const lineRegExp = new RegExp(`^${HRCD_GITHUB_LINK_MARKER}`);

const api = axios.create({
  baseURL: 'https://api.github.com/',
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  },
});

const getPrBody = () => api
  .get(prUrl)
  .then(({ data: { body } }) => body)
  .catch((e) => { throw e; });

const setPrBody = (body) => api
  .patch(prUrl, { body })
  .catch((e) => { throw e; });

const createPrLink = async (hostname = required('hostname')) => {
  const prBody = await getPrBody();
  const newPrBody = [
    `${HRCD_GITHUB_LINK_MARKER} [${hostname}](${hostname}) ${HRCD_GITHUB_LINK_READY}`,
    prBody,
  ].join(splitter);

  return setPrBody(newPrBody);
};

const deletePrLink = async () => {
  const prBody = await getPrBody();
  const newPrBody = prBody
    .split(splitter)
    .filter((line) => !line.match(lineRegExp))
    .join(splitter);

  return setPrBody(newPrBody);
};

const markPrLink = async (isPending) => {
  const prBody = await getPrBody();
  const newPrBody = prBody
    .split(splitter)
    .map((line) => {
      if (!line.match(lineRegExp)) return line;
      return isPending
        ? line.replace(HRCD_GITHUB_LINK_READY, HRCD_GITHUB_LINK_PENDING)
        : line.replace(HRCD_GITHUB_LINK_PENDING, HRCD_GITHUB_LINK_READY);
    })
    .join(splitter);

  return setPrBody(newPrBody);
};

module.exports = {
  createPrLink,
  deletePrLink,
  markPrLink,
};
