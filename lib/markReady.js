#!/usr/bin/env node

const github = require('./api/github');

module.exports = () => github.markPrLink(false);
