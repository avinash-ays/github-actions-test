const api = require("@webscraperio/api-client-nodejs");
const Client = api.Client;

const client = new Client({
    token: "mKKBeVdzK6OETH8bRvnTKwTC55hWQoOhOCdLvyDS4u6Fds3nC3CppbUpx4wI",
    useBackoffSleep: false
});

module.exports = client;
