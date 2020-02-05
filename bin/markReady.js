const heracudo = require('../lib');

(async () => {
  if (!process.env.HEROKU_APP_NAME || !process.env.HEROKU_PR_NUMBER) return;
  await heracudo.markReady();
})();
