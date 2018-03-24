const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const serviceSchema = new Schema({
  serviceNumber: Number,
  name: String,
  lastCorId: String,
  timestamp: Date
});

const ServiceModel = Mongoose.model('Service', serviceSchema);

exports.ServiceModel = ServiceModel;
