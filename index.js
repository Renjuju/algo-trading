
const Gdax = require('gdax');
const secrets = require('./secrets');

const { key, b64secret, passphrase } = secrets;
const apiURI = 'https://api.gdax.com';

const authedClient = new Gdax.AuthenticatedClient(key, b64secret, passphrase, apiURI);

authedClient.getAccounts((error, response, data) => {
  if (error) {
    console.error(error);
  } else {
    console.log(data);
  }
});
