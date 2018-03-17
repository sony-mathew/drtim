// Basic modules
const express = require('express');
const app = express();
const port = process.env.PORT || 4040;
const request = require('request');
const bodyParser = require('body-parser');  
const url = require('url');  
const querystring = require('querystring'); 
const requestTracer = require('../../middlewares/node');

app.use(requestTracer.DRTIM);
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// registering routes ==================================
app.get('/', (req, res) => {
  res.render('index.html');
});

app.get('/status', (req, res) => {
  res.render('index.html');
});

app.get('/ip', (req, res) => {
  // console.log(req.params);
  // console.log(req.query);

  const ip = req.query['ip'];
  // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;

  request({
    url: `http://localhost:8080/search?ip=${ip}`,
    headers: {
      'X-DRTIM-COR-ID': res.get('X-DRTIM-COR-ID'),
      'X-DRTIM-COR-CHILD': res.get('X-DRTIM-COR-CHILD')
    }
  }, function (error, response, body) {
    if (error) {
      console.log('error:', error);
    }
    res.send(body);
  });
});


// start server ========================================
app.listen(port, () => {
  console.log(`API Service App listening on port ${port}`);
});

module.exports = app;
