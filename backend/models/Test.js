const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  testName: { type: String, required: true },
  disease: { type: String, required: true },
  result: { type: String, default: 'Pending' },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Test', TestSchema);

