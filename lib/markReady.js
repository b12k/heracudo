module.exports = () => process.env.HEROKU_APP_NAME
  && process.env.HEROKU_PR_NUMBER
  && require('./api/github').markPrLink(false);
