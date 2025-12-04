const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  filepath: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 0
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  usageCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Track', trackSchema);
