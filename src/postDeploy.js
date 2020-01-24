import parseDomain from 'parse-domain';

import {
  cloudflare,
  heroku,
  github,
} from './api';
import { required } from './helpers';

(async () => {
  const {
    env: {
      DOMAIN = required('DOMAIN'),
    },
  } = process;

  const {
    data: {
      result: dnsRecords,
    },
  } = await cloudflare.getDnsRecords().catch((e) => console.log(':::!CLOUDFLARE ERROR!:::', e));

  const {
    subdomain = '',
    domain,
    tld,
  } = parseDomain(DOMAIN);

  let reviewAppSubdomain = subdomain && `-${subdomain}`;
  console.log({ subdomain, reviewAppSubdomain });
  let reviewAppHostname = `${reviewAppSubdomain}.${domain}.${tld}`;
  const reviewAppDnsRecords = dnsRecords.filter(({ name }) => name.match(new RegExp(`^[0-9]${reviewAppHostname}`)));

  let appNum = 1;
  if (reviewAppDnsRecords.length) {
    const existingNums = reviewAppDnsRecords.map(({ name }) => Number(name.split('-')[0]));
    while (existingNums.includes(appNum)) appNum += 1;
  }

  reviewAppSubdomain = appNum + subdomain;
  reviewAppHostname = appNum + reviewAppHostname;

  const {
    data: {
      cname,
    },
  } = await heroku.createDomain(reviewAppHostname).catch((e) => console.log(':::!HEROKU ERROR!:::', e));

  await Promise.all([
    cloudflare.createDnsRecord(reviewAppSubdomain, cname).catch((e) => console.log(':::!CLOUDFLARE ERROR!:::', e)),
    github.createPrLink(`https://${reviewAppHostname}`).catch((e) => console.log(':::!GITHUB ERROR!:::', e)),
  ]);
})();
