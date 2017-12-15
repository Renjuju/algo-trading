const Gdax = require('gdax');
const express = require('express');
const bunyan = require('bunyan');
const cors = require('cors');

const http = require('http');

const log = bunyan.createLogger({
  name: 'algo-trader',
  // streams: [{
  //   path: `${__dirname}/algo-trader.log`,
  // }],
});

const app = express().use(cors());

const secrets = require('./secrets');

const { key, b64secret, passphrase } = secrets;
const apiURI = 'https://api.gdax.com';

const authedClient = new Gdax.AuthenticatedClient(key, b64secret, passphrase, apiURI);
const websocket = new Gdax.WebsocketClient(['ETH-USD']);

let currentEthTradePrice = 0;
let count = 0;
let total = 0;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  websocket.on('message', (data) => {
    if (data.type === 'received') {
      if (!isNaN(parseInt(data.price, 10))) {
        count += 1;
        currentEthTradePrice = parseFloat(data.price, 10);
        total += currentEthTradePrice;
      }
      log.info(`received at: ${data.price}`);
      if (data.price) {
        res.write(JSON.stringify(data));
      }
    }
  });
}).listen(8080);
// websocket.on('message', (data) => {
//   if (data.type == 'received') {
//     log.info(`received at: ${data.price}`);
//   }
// });
// Gets account information [BTC, ETH, LTC, USD]

app.get('/getEthValue', (req, res) => {
  res.send({
    currentEthTradePrice,
    count,
    average: total / count,
  });
});
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
