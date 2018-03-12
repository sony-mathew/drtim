// Basic modules
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const drtim = require('../../middlewares/node');

app.use(drtim.DRTIM);

// registering routes ==================================
app.get('/', (req, res) => {
  res.send({
    title: 'API Server'
  });
});


// start server ========================================
app.listen(port, () => {
  console.log(`API Service App listening on port ${port}`);
});

module.exports = app;
