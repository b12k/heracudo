module.exports = async () => {
  try {
    const required = require('./helpers/required');
    const github = require('./api/github');

    if (!process.env.HEROKU_APP_NAME) {
      required('HEROKU_APP_NAME');
    }
    if (!process.env.HEROKU_PR_NUMBER) {
      required('HEROKU_PR_NUMBER');
    }
    await github.markPrLink(true);
  } catch (e) {
    process.exit(1);
  }
};
