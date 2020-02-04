module.exports = (name = '') => {
  const variable = name ? `"${name}"` : 'Variable';
  throw new SyntaxError(`${variable} required but not defined.`);
};
