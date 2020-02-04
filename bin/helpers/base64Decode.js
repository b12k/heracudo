module.exports = (string) => Buffer
  .from(string, 'base64')
  .toString('binary');
