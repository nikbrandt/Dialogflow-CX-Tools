const { JWT } = require('google-auth-library');

const key = require('../key.json');
const { scopes } = require('../apiSettings.json');

const client = new JWT({
    email: key.client_email,
    key: key.private_key,
    scopes
});

module.exports = client;