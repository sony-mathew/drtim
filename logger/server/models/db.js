const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const Log = require('./log');
const Service = require('./service');

Mongoose.connect('mongodb://localhost/drtim');

exports.Mongoose = Mongoose;
exports.Log = Log.LogModel;
exports.Service = Service.ServiceModel;