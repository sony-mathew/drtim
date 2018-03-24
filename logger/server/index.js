const net = require('net');
const DB = require('./models/db');
const Merge = require('deepmerge');

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
      let service = await this.getService(payload.service);

      if (corrData) {
        let log = await this.getLogEntry(corrData.corId);
        if (log) {
          log = await this.update(corrData, payload, log);
        } else  {
          log = await this.create(corrData, payload);
        }

        service.lastCorId = log.corId;
        await service.save();
      } else {
        if (service.lastCorId) {
          let log = await this.getLogEntry(service.lastCorId);
          await this.update(corrData, payload, log, true); 
        }
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

  async getService(serviceNumber) {
    let serviceRec = await DB.Service.findOne({ "serviceNumber" : serviceNumber });
    if (!serviceRec) {
      serviceRec = new DB.Service({ serviceNumber: serviceNumber, timestamp: (new Date()) });
      await serviceRec.save();
    }
    return serviceRec;
  }

  getCorrelationID(content) {
    const match = content.match(/\[DRTIM-COR-ID\s[a-z0-9]+\s(\d|\-)+\]/)
    if (match) {
      const header = match[0];

      let corId = header.match(/[a-z0-9]+/)[0] || '';
      let childIdChain = header.match(/\s(\d|\-)+\]/)[0] || '';
      childIdChain = childIdChain.trim().replace(']', '');

      return { corId: corId, childIdChain: childIdChain };
    }

    return false;
  }

  createRelation(relation, childIdChain) {
    let ids = childIdChain.split('-').map((id) => parseInt(id));
    let chain = 'x';
    for(let i = ids.length - 1; i >= 0; --i) {
      chain = { [ids[i]]: chain };
    }

    let merged = Merge(relation, chain);
    console.log(relation, chain, merged);
    return merged;
  }

  async update(corrData, payload, log, onlyContent = false) {
    if(!onlyContent) {
      log.relation = this.createRelation(log.relation || {}, corrData.childIdChain);
      log.markModified('relation'); 
    }

    log.content = log.content || {};
    log.content[payload.service] = log.content[payload.service] || [];
    log.content[payload.service].push({ timestamp: payload.timestamp, content: payload.content });
    log.markModified('content');

    await log.save();
    console.log('Saved ', log.corId);
    return log;
  }

  async create(corrData, payload) {
    let log = new DB.Log({ 
      corId: corrData.corId,
      relation: this.createRelation({}, corrData.childIdChain),
      timestamp: payload.timestamp,
      content: { [payload.service]: [{ timestamp: payload.timestamp, content: payload.content }]}
    });
    await log.save();
    console.log('Created ', log.corId);
    return log;
  }
}

let SL = new StoreLog();
var server = net.createServer(function(socket) {
  socket.on('data', async function(data) {
    let strData = data.toString();
    try {
      strData = strData.split('||||');
      strData.pop(); // last element will be empty
      for(i = 0; i < strData.length; ++i) {
        const payload = JSON.parse(strData[i].trim());
        await SL.queueForStoring(payload);
        console.log(`[${payload.service}][${payload.timestamp}] ${payload.content}`);
      }
    } catch(e) {
      console.log('Parse error.', strData, e);
    }
  });
});

server.listen(1337, '127.0.0.1');