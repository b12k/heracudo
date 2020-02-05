const markPending = require('./markPending');
const markReady = require('./markReady');
const postDeploy = require('./postDeploy');
const preDestroy = require('./preDestroy');

module.exports = {
  markPending,
  markReady,
  postDeploy,
  preDestroy,
};
