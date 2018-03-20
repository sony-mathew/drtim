const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const logSchema = new Schema({
  corId: String,
  relation: {},
  timestamp: Date,
  content: {}
});

const LogModel = Mongoose.model('Log', logSchema);

exports.LogModel = LogModel;
