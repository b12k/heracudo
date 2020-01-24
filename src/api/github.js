import axios from 'axios';

import {
  required,
  base64Decode,
} from '../helpers';

const {
  env: {
    GITHUB_REPOSITORY = required('GITHUB_REPOSITORY'),
    GITHUB_TOKEN = required('GITHUB_TOKEN'),
    HEROKU_PR_NUMBER = required('HEROKU_PR_NUMBER'),
    GITHUB_PR_LINK_MARKER = '### Preview:',
  },
} = process;

const api = axios.create({
  baseURL: 'https://api.github.com/',
  headers: {
    Authorization: `token ${base64Decode(GITHUB_TOKEN)}`,
    Accept: 'application/vnd.github.v3+json',
  },
});

const prUrl = `repos/${GITHUB_REPOSITORY}/pulls/${HEROKU_PR_NUMBER}`;
const splitter = '\r\n';
const getPrBody = () => api.get(prUrl).then(({ data: { body } }) => body);
const setPrBody = (body) => api.patch(prUrl, { body });
const createPrLink = async (hostname = required('hostname')) => setPrBody([
  `${GITHUB_PR_LINK_MARKER} [${hostname}](${hostname})`,
  await getPrBody(),
].join(splitter));
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
