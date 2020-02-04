#!/usr/bin/env node
"use strict";

var _api = require("./api");

(async () => {
  const [{
    data: domains
  }, {
    data: {
      result: dnsRecords
    }
  }] = await Promise.all([_api.heroku.getDomains(), _api.cloudflare.getDnsRecords()]);
  const promises = domains.reduce((acc, {
    cname,
    hostname
  }) => {
    const dnsRecord = dnsRecords.find(({
      content
    }) => content === cname);
    if (!dnsRecord) return acc;
    return [...acc, _api.cloudflare.deleteDnsRecord(dnsRecord.id), _api.heroku.deleteDomain(hostname)];
  }, []);
  await Promise.all([...promises, _api.github.deletePrLink()]);
})();