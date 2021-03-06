module.exports = async () => {
  try {
    const cloudflare = require('./api/cloudflare');
    const heroku = require('./api/heroku');
    const github = require('./api/github');

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
  } catch (e) {
    console.error(e); // eslint-disable-line
    process.exit(1);
  }
};
