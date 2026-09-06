const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  fromType: { type: String, enum: ['restaurant', 'ngo'], required: true },
  fromId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'fromModel' },
  fromModel: { type: String, enum: ['Restaurant', 'NGO'], required: true },
  toType: { type: String, enum: ['restaurant', 'ngo'], required: true },
  toId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'toModel' },
  toModel: { type: String, enum: ['Restaurant', 'NGO'], required: true },
  stars: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, default: '' },
  isComplaint: { type: Boolean, default: false },
  seenByRecipient: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);