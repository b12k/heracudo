#!/usr/bin/env node
"use strict";

var _parseDomain = _interopRequireDefault(require("parse-domain"));

var _api = require("./api");

var _helpers = require("./helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(async () => {
  const {
    env: {
      DOMAIN = (0, _helpers.required)('DOMAIN')
    }
  } = process;
  const {
    data: {
      result: dnsRecords
    }
  } = await _api.cloudflare.getDnsRecords().catch(e => console.log(':::!CLOUDFLARE ERROR!:::', e));
  const {
    subdomain = '',
    domain,
    tld
  } = (0, _parseDomain.default)(DOMAIN);
  let reviewAppSubdomain = subdomain && `-${subdomain}`;
  console.log({
    subdomain,
    reviewAppSubdomain
  });
  let reviewAppHostname = `${reviewAppSubdomain}.${domain}.${tld}`;
  const reviewAppDnsRecords = dnsRecords.filter(({
    name
  }) => name.match(new RegExp(`^[0-9]${reviewAppHostname}`)));
  let appNum = 1;

  if (reviewAppDnsRecords.length) {
    const existingNums = reviewAppDnsRecords.map(({
      name
    }) => Number(name.split('-')[0]));

    while (existingNums.includes(appNum)) appNum += 1;
  }

  reviewAppSubdomain = appNum + subdomain;
  reviewAppHostname = appNum + reviewAppHostname;
  const {
    data: {
      cname
    }
  } = await _api.heroku.createDomain(reviewAppHostname).catch(e => console.log(':::!HEROKU ERROR!:::', e));
  await Promise.all([_api.cloudflare.createDnsRecord(reviewAppSubdomain, cname).catch(e => console.log(':::!CLOUDFLARE ERROR!:::', e)), _api.github.createPrLink(`https://${reviewAppHostname}`).catch(e => console.log(':::!GITHUB ERROR!:::', e))]);
})();