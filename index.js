const Gdax = require('gdax');
const express = require('express');
const bunyan = require('bunyan');

const log = bunyan.createLogger({
  name: 'algo-trader',
  // streams: [{
  //   path: `${__dirname}/algo-trader.log`,
  // }],
});

const app = express();
const secrets = require('./secrets');

const { key, b64secret, passphrase } = secrets;
const apiURI = 'https://api.gdax.com';

const authedClient = new Gdax.AuthenticatedClient(key, b64secret, passphrase, apiURI);

// Gets account information [BTC, ETH, LTC, USD]
app.get('/getAccounts', (req, res) => {
  authedClient.getAccounts((error, response, data) => {
    if (error) {
      log.error(error);
      res.send(error);
    } else {
      log.info(data);
      res.send(data);
    }
  });
});

app.get('/products', (req, res) => {
  authedClient.getProducts().then((data) => {
    log.info(data);
    res.send(data);
  });
});

app.get('/orders', (req, res) => {
  authedClient.getOrders().then((data) => {
    res.send(data);
  });
});

app.get('/trades', (req, res) => {
  authedClient.getAccountHistory('96f91c70-26a2-44ef-831e-ab0c76ce8a33', (error, response, data) => {
    if (error) {
      log.error(error);
      res.send(error);
    } else {
      log.info(data);
      res.send(data);
    }
  });
});

app.listen(3500, () => {
  log.info('connected');
});
