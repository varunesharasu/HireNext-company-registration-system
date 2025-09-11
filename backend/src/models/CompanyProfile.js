const mongoose = require('mongoose');

const companyProfileSchema = new mongoose.Schema({
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company_name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  postal_code: { type: String, required: true },
  website: { type: String },
  logo_url: { type: String },
  banner_url: { type: String },
  industry: { type: String, required: true },
  founded_date: { type: Date },
  description: { type: String },
  social_links: { type: Object },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CompanyProfile', companyProfileSchema);
