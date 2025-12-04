const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true},
  email: { type: String, unique: true},
  phone: { type: String, unique: true},
  bloodgroup: { type: String },
  age: { type: Number },
  password: { type: String, required: true },
  role: { type: String, required: true , default: 'patient' },
  services: { type: [String] }, // Only for patients
  specialization: { type: String }  // Only for doctors
});

module.exports = mongoose.model('User', UserSchema);