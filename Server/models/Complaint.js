const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  filedBy: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'filedByModel' },
  filedByModel: { type: String, enum: ['Restaurant', 'NGO'], required: true },
  againstUser: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'againstModel' },
  againstModel: { type: String, enum: ['Restaurant', 'NGO'], required: true },
  category: {
    type: String,
    enum: [
      'Food Quality / Spoilage',
      'No-Show / Missed Pickup',
      'Quantity or Description Mismatch',
      'Packaging & Hygiene Concern',
      'Communication / Misbehavior',
      'Other'
    ],
    required: true
  },
  subject: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  urgency: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Pending', 'Under Investigation', 'Resolved', 'Dismissed'],
    default: 'Pending'
  },
  adminResolution: { type: String, default: '' },
  resolvedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
