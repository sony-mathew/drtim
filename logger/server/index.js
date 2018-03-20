const net = require('net');
const DB = require('./models/db');

class StoreLog {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  queueForStoring(payload) {
    this.queue.push(payload);
    this.save();
  }

  async save() {
    if (this.queue.length > 0 && !this.processing) {
      this.processing = true;

      let payload = this.queue[0];
      let corrData = this.getCorrelationID(payload.content);
      if (corrData) {
        let log = await this.getLogEntry(corrData.corId);
        if (log) {
          await this.update(corrData, payload, log);
        } else  {
          await this.create(corrData, payload);
        }
      } else {
        //
      }
      this.queue.splice(0, 1);
      this.processing = false;

      if (this.queue.length > 0) {
        this.save();
      }
    }
  }

  async getLogEntry(corId) {
    let log = await DB.Log.findOne({ "corId" : corId });
    return log;
  }

  async setServiceName(serviceName) {
    let serviceRec = await DB.Service.findOne({ "name" : serviceName });
    if (!serviceRec) {
      const service = new DB.Service({ name: serviceName, timestamp: (new Date()) });
      await service.save();
    }
  }

  getCorrelationID(content) {
    const match = content.match(/\[DRTIM-COR-ID\s[a-z0-9]+\s\d\]/);
    if (match) {
      const header = match[0];

      let corId = header.match(/[a-z0-9]+/)[0] || '';
      let childId = header.match(/\s\d\]/)[0] || '';
      childId = childId.trim().replace(']', '');

      return { corId: corId, childId: childId };
    }

    return false;
  }

  async update(corrData, payload, log) {
    log.relation = log.relation || {};
    log.relation[corrData.childId] = log.relation[corrData.childId] || [];
    log.relation[corrData.childId].push(payload.service);

    log.content = log.content || {};
    log.content[payload.service] = log.content[payload.service] || [];
    log.content[payload.service].push({ timestamp: payload.timestamp, content: payload.content });

    log.markModified('relation');
    log.markModified('content');

    await log.save();
    console.log('Saved ', corrData.corId);
  }

  async create(corrData, payload) {
    let log = new DB.Log({ 
      corId: corrData.corId,
      relation: { [corrData.childId]: [ payload.service ] },
      timestamp: payload.timestamp,
      content: { [payload.service]: [{ timestamp: payload.timestamp, content: payload.content }]}
    });
    await log.save();
    console.log('Created ', corrData.corId);
  }
}

let SL = new StoreLog();
var server = net.createServer(function(socket) {
  socket.on('data', async function(data) {
    const strData = data.toString();
    try {
      const payload = JSON.parse(strData);
      await SL.queueForStoring(payload);
      console.log(`[${payload.service}\t][${payload.timestamp}] ${payload.content}`);
    } catch(e) {
      console.log('Parse error.', e);
    }
  });
});

server.listen(1337, '127.0.0.1');