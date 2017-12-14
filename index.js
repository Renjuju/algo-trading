const crypto = require('crypto');
const http = require('http');
const secrets = require('./secrets');

const { secretKey, passPhrase } = secrets;

function buildAccessSign(method, requestPath, body) {
  const timestamp = Date.now() / 1000;
  const what = timestamp + method + requestPath + body;
  const key = Buffer.from(secretKey, 'base64');
  const hmac = crypto.createHmac('sha256', key);

  return hmac.update(what).digest('base64');
}

function getHeaders(method, requestPath, body) {
  return {
    'CB-ACCESS-SIGN': buildAccessSign(method, requestPath, body),
    'CB-ACCESS-KEY': secretKey,
    'CB-ACCESS-TIMESTAMP': Date.now(),
    'CB-ACCESS-PASSPHRASE': passPhrase,
  };
}

console.log(getHeaders('GET', '/accounts'));

const options = {
  port: 1337,
  hostname: '127.0.0.1',
  headers: getHeaders('GET', '/accounts'),
};

// const req = http.request(options);
