const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  foodType: { type: String, enum: ['Rice', 'Curry', 'Roti', 'Snacks', 'Sweets', 'Other'], required: true },
  quantity: { type: Number, required: true },
  peopleFed: { type: Number, required: true },
  freshFor: { type: String, enum: ['1hr', '2hrs', '4hrs', '6+ hrs'], required: true },
  expiresAt: { type: Date, required: true },
  status: { type: String, enum: ['Notified', 'Claimed', 'Out for Pickup', 'Picked Up', 'Expired'], default: 'Notified' },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', default: null },
  pickupPin: { type: String, default: null },
  enRouteAt: { type: Date, default: null },
  estimatedArrival: { type: String, default: '' },
  vehicleType: { type: String, default: '' },
  postedAt: { type: Date, default: Date.now },
  notifiedAt: { type: Date, default: Date.now },
  claimedAt: { type: Date, default: null },
  pickedUpAt: { type: Date, default: null },
  expiredAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);