const axios = require('axios');

const required = require('../helpers/required');

const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY || required('GITHUB_REPOSITORY');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || required('GITHUB_TOKEN');
const HEROKU_PR_NUMBER = process.env.HEROKU_PR_NUMBER || required('HEROKU_PR_NUMBER');
const GITHUB_PR_LINK_MARKER = process.env.GITHUB_PR_LINK_MARKER || '## Review App:';

const prUrl = `repos/${GITHUB_REPOSITORY}/pulls/${HEROKU_PR_NUMBER}`;
const splitter = '\r\n';

const api = axios.create({
  baseURL: 'https://api.github.com/',
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  },
});

const getPrBody = () => api.get(prUrl).then(({ data: { body } }) => body);

const setPrBody = (body) => api.patch(prUrl, { body });

const createPrLink = async (hostname = required('hostname')) => {
  const prBody = await getPrBody();
  const newPrBody = [
    `${GITHUB_PR_LINK_MARKER} [${hostname}](${hostname})`,
    prBody,
  ].join(splitter);
  return setPrBody(newPrBody);
};

const deletePrLink = async () => {
  const prBody = await getPrBody();
  const lineRegExp = new RegExp(`^${GITHUB_PR_LINK_MARKER}`);
  const newPrBody = prBody
    .split(splitter)
    .filter((line) => !line.match(lineRegExp))
    .join(splitter);

  return setPrBody(newPrBody);
};

module.exports = {
  createPrLink,
  deletePrLink,
};
