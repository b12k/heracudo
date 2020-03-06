module.exports = async () => {
  try {
    if (process.env.HEROKU_APP_NAME && process.env.HEROKU_PR_NUMBER) {
      await require('./api/github').markPrLink(true);
    }
  } catch (e) {
    console.error(e); // eslint-disable-line
    process.exit(1);
  }
};
