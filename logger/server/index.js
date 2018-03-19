const net = require('net');
const DB = require('./models/db');

class StoreLog {
  constructor() {}

  save(content) {

  }

  async getLogEntry(cordId) {
    let some = await DB.Log.find({ cordId: cordId });
  }

  getServiceName() {

  }

  getCorrelationID(content) {
    const match = content.match(/\[DRTIM-COR-ID\s[a-z0-9]+\s\d\]/);
    if (match) {
      const header = match[0];

      let cordId = header.match(/[a-z0-9]+/)[0];
      let childId = header.match(/\s\d\]/);
      childId = childId.trim().replace(']', '');

      return { cordId: cordId, childId: childId };
    }

    return false;
  }
}

var server = net.createServer(function(socket) {
  socket.on('data', async function(data) {
    const strData = data.toString();
    try {
      const payload = JSON.parse(strData);
      console.log(`[${payload.service}\t][${payload.timestamp}] ${payload.content}`);
    } catch(e) {
      console.log('Parse error.');
    }
  });
});

server.listen(1337, '127.0.0.1');