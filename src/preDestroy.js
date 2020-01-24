import {
  cloudflare,
  heroku,
  github,
} from './api';

(async () => {
  const [
    {
      data: domains,
    },
    {
      data: {
        result: dnsRecords,
      },
    },
  ] = await Promise.all([
    heroku.getDomains(),
    cloudflare.getDnsRecords(),
  ]);

  const promises = domains.reduce((acc, { cname, hostname }) => {
    const dnsRecord = dnsRecords.find(({ content }) => content === cname);
    if (!dnsRecord) return acc;
    return [
      ...acc,
      cloudflare.deleteDnsRecord(dnsRecord.id),
      heroku.deleteDomain(hostname),
    ];
  }, []);

  await Promise.all([
    ...promises,
    github.deletePrLink(),
  ]);
})();
