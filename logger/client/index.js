const net = require('net');
const STREAMING_SERVER = '127.0.0.1';
const STREAMING_SERVER_PORT = 1337;
const SERVICE_NAME = process.argv[2] || '';

class StreamingClient {

  constructor(cb) {
    this.client = new net.Socket();
    this.cb = cb;
    this.calledBack = false;
  }

  callback() {
    console.log('Connected again.');
    if (!this.calledBack) {
      if (typeof this.cb == 'function') {
        this.cb.call();
      }
      this.reconnect();
    }
    this.calledBack = true;
  }

  connect() {
    console.log('Connecting...');
    this.client.connect(STREAMING_SERVER_PORT, STREAMING_SERVER, this.callback.bind(this));
  }

  reconnect() {
    this.client.on('error', () => setTimeout(this.connect.bind(this), 5000));
    this.client.on('closed', () => setTimeout(this.connect.bind(this), 5000));
    this.client.on('end', () => setTimeout(this.connect.bind(this), 5000));
  }

  send(payload) {
    this.client.write(JSON.stringify(payload));
  }

  queue(content) {
    let payload = {
      service: SERVICE_NAME,
      timestamp: (new Date()),
      content: content
    };
    try {
      this.send(payload);
    } catch (e) {
      setTimeout(() => { this.queue(content); }, 10000);
    }
  }
}

class LoggerInput {

  constructor() {
    this.client = new StreamingClient(this.listenToInput.bind(this));
  }

  start() {
    this.client.connect();
  }

  listenToInput() {
    process.stdin.pipe(require('split')()).on('data', this.processLine.bind(this));
  }

  processLine(line) {
    console.log(line);
    this.client.queue(line);
  }
}

const logger = new LoggerInput();
logger.start();
