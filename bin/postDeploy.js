#!/usr/bin/env node

const parseDomain = require('parse-domain');

const cloudflare = require('./api/cloudflare');
const heroku = require('./api/heroku');
const github = require('./api/github');
const required = require('./helpers/required');
const asyncForEach = require('./helpers/asyncForEach');


(async () => {
  const {
    env: {
      DOMAINS = required('DOMAINS'),
    },
  } = process;

  const {
    data: {
      result: dnsRecords,
    },
  } = await cloudflare.getDnsRecords();

  await asyncForEach(DOMAINS.split(','), async (DOMAIN) => {
    const {
      subdomain = '',
      domain,
      tld,
    } = parseDomain(DOMAIN.trim());

    let reviewAppSubdomain = subdomain && `-${subdomain}`;
    let reviewAppHostname = `${reviewAppSubdomain}.${domain}.${tld}`;
    const reviewAppDnsRecords = dnsRecords.filter(({ name }) => name.match(new RegExp(`^[0-9]${reviewAppHostname}`)));

    let appNum = 1;
    if (reviewAppDnsRecords.length) {
      const existingNums = reviewAppDnsRecords.map(({ name }) => Number(name.split('-')[0]));
      while (existingNums.includes(appNum)) appNum += 1;
    }

    reviewAppSubdomain = appNum + reviewAppSubdomain;
    reviewAppHostname = appNum + reviewAppHostname;

    const {
      data: {
        cname,
      },
    } = await heroku.createDomain(reviewAppHostname);

    await Promise.all([
      cloudflare.createDnsRecord(reviewAppSubdomain, cname),
      github.createPrLink(`https://${reviewAppHostname}`),
    ]);
  });
})();
