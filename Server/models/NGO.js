const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, required: true },
  foodTypeNeeded: { type: String, enum: ['veg', 'non-veg', 'any'], required: true },
  peopleServed: { type: Number, required: true },
  resetPasswordOTP: { type: String, select: false },
  resetPasswordExpires: { type: Date, select: false }
}, { timestamps: true });

module.exports = mongoose.model('NGO', ngoSchema);