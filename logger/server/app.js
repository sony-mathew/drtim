// Basic modules
const express = require('express');
const app = express();
const port = process.env.PORT || 7777;
const bodyParser = require('body-parser');
const querystring = require('querystring');
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());
const DB = require('./models/db');
const PER_PAGE = 50;

const corsHandler = async (req, res, next) => {
  if (req.method == 'OPTIONS') {
    res.status = 200;
    res.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE, HEAD');
    res.set('Allow', 'OPTIONS, GET, POST, PUT, DELETE, HEAD');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
  } else {
    await next();
  }
  res.set('Access-Control-Allow-Origin', '*');
}

app.use(corsHandler);

// registering routes ==================================
app.get('/', (req, res) => {
  res.send({
    title: 'DRTIM Logger Server Service'
  });
});

app.get('/logs', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  let logs = await DB.Log.find()
    .limit(PER_PAGE)
    .skip(PER_PAGE * (page - 1))
    .sort({
      _id: 'asc'
    });
  res.send(logs);
});


// start server ========================================
app.listen(port, () => {
  console.log(`DRTIM Logger Server Service App listening on port ${port}`);
});

module.exports = app;