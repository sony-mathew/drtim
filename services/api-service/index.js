// Basic modules
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const request = require('request');
const bodyParser = require('body-parser');  
const url = require('url');  
const querystring = require('querystring'); 
const requestTracer = require('../../middlewares/node');

requestTracer.DRTIM.service = 2;
app.use(requestTracer.DRTIM.bind(requestTracer.DRTIM));

app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());

// registering routes ==================================
app.get('/', (req, res) => {
  res.send({
    title: 'API Service'
  });
});

app.get('/search', (req, res) => {
  // console.log(req.params);
  // console.log(req.query);

  const ip = req.query['ip'];

  request(`http://freegeoip.net/json/${ip}`, function (error, response, body) {
    res.send(body);
  });
});


// start server ========================================
app.listen(port, () => {
  console.log(`API Service App listening on port ${port}`);
});

module.exports = app;
