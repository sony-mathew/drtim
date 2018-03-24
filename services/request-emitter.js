const RequestPromise = require('request-promise');

class RequestEmitter {

  constructor(params, servicesConfig, res) {
    this.params = params;
    this.servicesConfig = servicesConfig;
    this.res = res;
  }

  async process() {
    await this.parseParams();
  }

  async callService(serviceNumber, payload) {

    console.log('Inside call service');
    serviceNumber = parseInt(serviceNumber);
    const service = this.servicesConfig[serviceNumber];

    if (!service) {
      console.log('Invalid service #', serviceNumber);
      return;
    }

    const URL = `${this.servicesConfig.commonHost}:${service.port}/call`;

    console.log(`Calling ${service.name} with payload : ${payload}`);

    let requestOptions = {
      url: URL,
      method: 'POST',
      headers: {
        'X-DRTIM-COR-ID': this.res.get('X-DRTIM-COR-ID'),
        'X-DRTIM-COR-CHILD': this.res.get('X-DRTIM-COR-CHILD')
      }
    };

    if(payload) {
      payload = this.normalizePayload(payload);
      requestOptions.json = true;
      requestOptions.body = payload;
    }

    await RequestPromise(requestOptions);
  }

  async parseParams() {
    console.log('Inside parseParams', isNaN(this.params));
    if(isNaN(this.params)) {

      let servicesToCall = Object.keys(this.params);

      for(let i = 0; i < servicesToCall.length; ++i) {
        let payload = this.params[servicesToCall[i]];
        await this.callService(servicesToCall[i], payload);
      }

    } else {
      await this.callService(parseInt(this.params), '');
    }
  }

  normalizePayload(payload) {
    if (!isNaN(payload)) {
      payload = payload.toString();
      if (payload.length > 0) {
        payload = { [payload]: '' };
      } else {
        payload = {}
      }
    }
    return payload;
  }

}

exports.RequestEmitter = RequestEmitter;
