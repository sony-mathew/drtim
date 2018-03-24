const sha256 = require('js-sha256');

const hasher = (h) => {
  let str = JSON.stringify(h);
  let hash = sha256.create();
  hash.update(str);
  return hash.hex().substr(0, 32);
};

const logRequest = (req, res) => {
  const header = `[DRTIM-COR-ID ${res.get('X-DRTIM-COR-ID')} ${res.get('X-DRTIM-COR-CHILD')}]`;
  console.log(`${header} Starting ${req.method} for ${req.originalUrl} at ${(new Date).toString()}`);
};

const drtim = function(req, res, next) {
  var drtimHeader = req.get('X-DRTIM-COR-ID');
  var drtimChildID = req.get('X-DRTIM-COR-CHILD');

  if (drtimChildID) {
    drtimChildID = `${drtimChildID}-${this.service}`;
  } else {
    drtimChildID = `${this.service}`;
  }

  if (drtimHeader) {
    res.setHeader('X-DRTIM-COR-ID', drtimHeader);
  } else {
    var uniqID = hasher({ time: (new Date()).toString() });
    res.setHeader('X-DRTIM-COR-ID', uniqID);
  }
  res.setHeader('X-DRTIM-COR-CHILD', drtimChildID);
  
  logRequest(req, res);

  next();
};

exports.DRTIM = drtim;
