module.exports = {
  decode: (string) => Buffer
    .from(string, 'base64')
    .toString('ascii'),
};
