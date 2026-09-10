import { useState } from 'react';
import axios from 'axios';
import { useToast } from './ToastContext';
import Button from './Button';

const CATEGORIES = [
  'Food Quality / Spoilage',
  'No-Show / Missed Pickup',
  'Quantity or Description Mismatch',
  'Packaging & Hygiene Concern',
  'Communication / Misbehavior',
  'Other'
];

const URGENCIES = [
  { value: 'Low', label: 'Low', color: 'text-gray-600 bg-gray-100 border-gray-200' },
  { value: 'Medium', label: 'Medium', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { value: 'High', label: 'High', color: 'text-orange-700 bg-orange-50 border-orange-200' },
  { value: 'Critical', label: 'Critical', color: 'text-red-700 bg-red-50 border-red-200' },
];

export default function ComplaintModal({ isOpen, onClose, listing, onSubmitted }) {
  const { showToast } = useToast();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [urgency, setUrgency] = useState('Medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !listing) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      showToast('Please fill in both a subject and a description.', 'error');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/complaints', {
        listingId: listing._id,
        category,
        urgency,
        subject: subject.trim(),
        description: description.trim(),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showToast(res.data.message || 'Complaint filed successfully!', 'success');
      if (onSubmitted) onSubmitted(res.data.complaint);
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to file complaint', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#E7E5E0] relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 border border-red-100">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-ink">Report an Issue / Dispute</h2>
            <p className="text-xs text-ink-soft">
              Filing issue for <strong className="text-ink">{listing.foodType}</strong> ({listing.quantity}kg)
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">
              Issue Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-ink"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Urgency Level */}
          <div>
            <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">
              Urgency Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {URGENCIES.map((u) => (
                <button
                  type="button"
                  key={u.value}
                  onClick={() => setUrgency(u.value)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    urgency === u.value
                      ? `${u.color} ring-2 ring-offset-1 ring-primary/40 shadow-xs`
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">
              Issue Summary <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Food arrived spoiled / NGO never showed up"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-ink placeholder:text-gray-400"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Please provide full details so the Admin review team can investigate and resolve this..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-ink placeholder:text-gray-400 resize-none"
              required
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-xs"
            >
              {loading ? 'Submitting...' : 'Submit to Admin'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
