const github = require('./api/github');

module.exports = () => process.env.HEROKU_APP_NAME
  && process.env.HEROKU_PR_NUMBER
  && github.markPrLink(true);
