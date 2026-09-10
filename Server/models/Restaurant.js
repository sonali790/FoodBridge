const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  location: { type: String, required: true },
  cuisineType: { type: String, required: true },
  resetPasswordOTP: { type: String, select: false },
  resetPasswordExpires: { type: Date, select: false }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);