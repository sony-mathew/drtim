SERVICE_NUMBER = 1;
const Config = require(__dirname + '/../services-config');
const servicesConfig = Config.ServicesConfig;
const OwnServiceConfig = servicesConfig[SERVICE_NUMBER];

const express = require('express');
const app = express();
const port = process.env.PORT || OwnServiceConfig.port;
const bodyParser = require('body-parser');  
const requestTracer = require('../../middlewares/node');
const serviceCaller = require('../request-emitter');

requestTracer.DRTIM.service = SERVICE_NUMBER;
app.use(requestTracer.DRTIM.bind(requestTracer.DRTIM));

app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// registering routes ==================================
app.get('/', (req, res) => {
  res.render('index.html');
});

app.get('/status', (req, res) => {
  res.send({
    name: OwnServiceConfig.name,
    port: OwnServiceConfig.port
  });
});

app.post('/call', async (req, res) => {
  let params = req.body;
  console.log(params);
  if (params) {
    let rem = new serviceCaller.RequestEmitter(params, servicesConfig, res);
    await rem.process();
    res.send({ success: 'Request Fulfilled.' });
  } else {
    res.send({ success: 'Last Service. Request Fulfilled.' });
  }
});


// start server ========================================
app.listen(port, () => {
  console.log(`${OwnServiceConfig.name} App listening on port ${port}`);
});

module.exports = app;
