const api = require("@webscraperio/api-client-nodejs");
const Client = api.Client;

const client = new Client({
    token: "o31qwOFJmShGsXvjwroK8MWb2CHbZoSoc8Esv2kKiF2n6f4uss62zrowPogf",
    useBackoffSleep: false
});

module.exports = client;
