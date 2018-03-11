const sha256 = require('js-sha256');

const hasher = (h) => {
  let str = JSON.stringify(h);
  let hash = sha256.create();
  hash.update(str);
  return hash.hex().substr(0, 32);
};

const drtim = (req, res, next) => {
  console.log('Time:', Date.now());
  
  var drtimHeader = req.getHeader('X-DRTIM-COR-ID');
  var drtimChildID = req.getHeader('X-DRTIM-COR-CHILD') || 0;

  if (drtimHeader) {
    res.setHeader('X-DRTIM-COR-ID', drtimHeader);
  } else {
    var uniqID = hasher({ time: (new Date()).toString() });
    res.setHeader('X-DRTIM-COR-ID', drtimHeader);
  }
  res.setHeader('X-DRTIM-COR-CHILD', drtimChildID + 1);

  next();
};

exports.DRTIM = drtim;
