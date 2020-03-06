module.exports = async () => {
  try {
    await require('./api/github').markPrLink(false);
  } catch (e) {
    const exitCode = process.env.HEROKU_APP_NAME || process.env.HEROKU_PR_NUMBER ? 1 : 0;

    console.error(e); // eslint-disable-line
    process.exit(exitCode);
  }
};
