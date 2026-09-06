const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientType: { type: String, enum: ['restaurant', 'ngo'], required: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, required: true },
  message: { type: String, required: true },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);