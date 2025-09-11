const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  full_name: { type: String, required: true },
  signup_type: { type: String, required: true, default: 'e' },
  gender: { type: String, required: true, enum: ['m', 'f', 'o'] },
  mobile_no: { type: String, required: true, unique: true },
  is_mobile_verified: { type: Boolean, default: false },
  is_email_verified: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
