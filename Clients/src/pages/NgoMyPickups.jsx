import { API_BASE_URL } from '../config/api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NgoLayout from '../components/NgoLayout';
import PageTransition from '../components/PageTransition';
import { useToast } from '../components/ToastContext';
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Star,
  Sparkles,
  RefreshCw,
  Building2,
  AlertCircle
} from 'lucide-react';

const STAGES = ['Notified', 'Claimed', 'Picked Up'];

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1.5 justify-center py-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="text-2xl transition-transform duration-150 hover:scale-125 focus:outline-none"
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          {n <= value ? 'â­' : 'â˜†'}
        </button>
      ))}
    </div>
  );
}

function NgoMyPickups() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingListing, setRatingListing] = useState(null);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');
  const [isComplaint, setIsComplaint] = useState(false);
  const [confirmingId, setConfirmingId] = useState(null);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'done'

  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');

  useEffect(() => {
    if (!token || role !== 'ngo') { navigate('/start/login'); return; }
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/listings/my-pickups`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPickups(res.data || []);
    } catch (err) {
      console.error('Error fetching pickups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    setConfirmingId(id);
    try {
      await axios.post(`${API_BASE_URL}/api/listings/${id}/confirm-pickup`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Pickup confirmed! Thank you for reducing food waste. ðŸŽ‰', 'success');
      fetchPickups();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to confirm pickup', 'error');
    } finally {
      setConfirmingId(null);
    }
  };

  const submitRating = async () => {
    setSubmittingRating(true);
    try {
      await axios.post(`${API_BASE_URL}/api/ratings`, {
        listingId: ratingListing._id, stars, comment, isComplaint
      }, { headers: { Authorization: `Bearer ${token}` } });
      showToast('Thank you! Rating submitted successfully.', 'success');
      setRatingListing(null);
      setStars(5); setComment(''); setIsComplaint(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit rating', 'error');
    } finally {
      setSubmittingRating(false);
    }
  };

  const activePickupsCount = pickups.filter(p => p.status === 'Claimed').length;
  const completedPickupsCount = pickups.filter(p => p.status === 'Picked Up').length;

  const filtered = filter === 'all' ? pickups
    : filter === 'active' ? pickups.filter(p => p.status === 'Claimed')
    : filter === 'done'   ? pickups.filter(p => p.status === 'Picked Up')
    : pickups;

  return (
    <NgoLayout>
      <PageTransition>
        <div className="space-y-8 font-sans bg-[#F8F6F3] text-[#1F2D23]">
          
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#D9A441] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-100" />
              <span>PICKUP MANAGEMENT</span>
            </div>
            <h1 className="text-[34px] font-extrabold text-[#1F2D23] tracking-tight leading-tight">
              My Pickups
            </h1>
            <p className="text-[#64748B] text-base mt-1">
              Track active claims, navigate to restaurant pickup locations, and confirm deliveries.
            </p>
          </div>

          {/* Filter Tabs & Summary Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E7E5E0] rounded-[20px] p-4 shadow-xs">
            <div className="flex gap-1.5 bg-[#F8F6F3] p-1.5 rounded-xl border border-[#E7E5E0] w-fit">
              {[
                ['all', `All (${pickups.length})`],
                ['active', `Active (${activePickupsCount})`],
                ['done', `Completed (${completedPickupsCount})`]
              ].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setFilter(val)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    filter === val
                      ? 'bg-[#3E5F48] text-white shadow-xs'
                      : 'text-[#64748B] hover:text-[#1F2D23]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={fetchPickups}
              className="text-xs font-semibold text-[#3E5F48] hover:underline flex items-center gap-1.5 self-end sm:self-center"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Status</span>
            </button>
          </div>

          {/* Pickups List / Empty State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <RefreshCw className="w-8 h-8 text-[#3E5F48] animate-spin" />
              <p className="text-sm font-medium text-[#64748B]">Loading your pickupsâ€¦</p>
            </div>
          ) : filtered.length === 0 ? (
            /* Empty State */
            <div className="bg-white border border-[#E7E5E0] rounded-[20px] p-12 text-center shadow-xs flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-[#E8F0E8] text-[#3E5F48] flex items-center justify-center mb-4">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2D23] mb-2">
                {filter === 'all' ? "You haven't claimed any listings yet" : `No ${filter} pickups found`}
              </h3>
              <p className="text-sm text-[#64748B] max-w-md mx-auto mb-6 leading-relaxed">
                Go to the Browse Listings section to explore available surplus food nearby and start claiming donations.
              </p>
              <button
                onClick={() => navigate('/ngo/browse')}
                className="bg-[#3E5F48] hover:bg-[#4F6A57] text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-2 mx-auto"
              >
                <span>Browse Available Food</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl">
              {filtered.map((p) => {
                const stageIndex = STAGES.indexOf(p.status);
                const isCompleted = p.status === 'Picked Up';
                return (
                  <div
                    key={p._id}
                    className="bg-white border border-[#E7E5E0] rounded-[20px] p-6 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                  >
                    {/* Top Row: Food Details & Status Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#E7E5E0]">
                      <div className="flex items-start gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-[#E8F0E8] text-[#3E5F48] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Truck className="w-5.5 h-5.5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#1F2D23] text-lg leading-snug">
                            {p.foodType} â€” <span className="text-[#3E5F48]">{p.quantity} kg</span>
                          </h3>
                          <p className="text-xs text-[#64748B] mt-0.5 flex items-center gap-2">
                            <span>Feeds ~{Math.round(p.quantity * 4)} people</span>
                            <span>Â·</span>
                            <span>Claimed {new Date(p.createdAt || Date.now()).toLocaleDateString()}</span>
                          </p>
                        </div>
                      </div>

                      <div className="self-start sm:self-center">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1.5 ${
                          isCompleted
                            ? 'bg-[#E2EDE5] text-[#3E5F48] border border-[#B8CDB4]'
                            : 'bg-[#F7EDD6] text-[#D9A441] border border-amber-200'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-[#3E5F48]' : 'bg-[#D9A441]'}`} />
                          {isCompleted ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                    </div>

                    {/* Middle Row: Restaurant Contact & Location Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F7EDD6] p-4 rounded-xl border border-amber-200/60 mb-6 text-xs text-[#64748B]">
                      <div className="flex items-start gap-2.5">
                        <Building2 className="w-4 h-4 text-[#D9A441] flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[#64748B] block text-[11px]">Restaurant Partner</span>
                          <span className="font-bold text-[#1F2D23] text-sm">{p.restaurant?.name || 'Partner Restaurant'}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-[#D9A441] flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[#64748B] block text-[11px]">Pickup Location</span>
                          <span className="font-bold text-[#1F2D23] text-sm truncate block">{p.restaurant?.location || 'Address provided upon claim'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Stepper Timeline Section */}
                    <div className="mb-6 space-y-2">
                      <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                        Pickup Progress Timeline
                      </p>
                      <div className="flex items-center gap-0">
                        {/* Step 1: Accepted (Green) */}
                        <div className="flex items-center flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors duration-300 ${
                            stageIndex >= 0 ? 'bg-[#3E5F48] text-white shadow-xs' : 'bg-gray-100 text-gray-400'
                          }`}>
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                          <div className={`flex-1 h-1 mx-2 rounded-full transition-colors duration-300 ${
                            stageIndex >= 1 ? 'bg-[#3E5F48]' : stageIndex === 0 ? 'bg-[#D9A441]' : 'bg-gray-100'
                          }`} />
                        </div>

                        {/* Step 2: In Progress / On the Way (Orange) */}
                        <div className="flex items-center flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors duration-300 ${
                            stageIndex >= 1
                              ? stageIndex === 1
                                ? 'bg-[#D9A441] text-white shadow-xs'
                                : 'bg-[#3E5F48] text-white shadow-xs'
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            {stageIndex >= 1 ? <CheckCircle2 className="w-4 h-4 text-white" /> : '2'}
                          </div>
                          <div className={`flex-1 h-1 mx-2 rounded-full transition-colors duration-300 ${
                            stageIndex >= 2 ? 'bg-[#3E5F48]' : 'bg-gray-100'
                          }`} />
                        </div>

                        {/* Step 3: Completed (Light Green / Green) */}
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors duration-300 ${
                            stageIndex >= 2 ? 'bg-[#3E5F48] text-white shadow-xs' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {stageIndex >= 2 ? <CheckCircle2 className="w-4 h-4 text-white" /> : '3'}
                          </div>
                        </div>
                      </div>

                      {/* Stage Labels */}
                      <div className="flex justify-between text-xs font-medium text-[#64748B] px-1 pt-1">
                        <span className="text-[#3E5F48] font-semibold">Accepted</span>
                        <span className="text-[#D9A441] font-semibold text-center">In Progress</span>
                        <span className="text-right">Completed</span>
                      </div>
                    </div>

                    {/* Bottom Action Row */}
                    <div className="pt-2">
                      {p.status === 'Claimed' && (
                        <button
                          onClick={() => handleConfirm(p._id)}
                          disabled={confirmingId === p._id}
                          className="w-full bg-[#3E5F48] hover:bg-[#4F6A57] text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-xs transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                          {confirmingId === p._id ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Confirming Pickupâ€¦</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Confirm Pickup Completed</span>
                            </>
                          )}
                        </button>
                      )}

                      {p.status === 'Picked Up' && (
                        <button
                          onClick={() => setRatingListing(p)}
                          className="w-full border border-[#3E5F48] text-[#3E5F48] hover:bg-[#E8F0E8] font-semibold text-sm py-2.5 px-4 rounded-xl transition-all duration-150 flex items-center justify-center gap-2"
                        >
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span>Rate Restaurant Experience</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Rating Modal */}
          {ratingListing && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 px-4">
              <div className="bg-white border border-[#E7E5E0] rounded-[24px] p-7 w-full max-w-md shadow-xl space-y-4">
                <div className="text-center">
                  <h3 className="font-extrabold text-[#1F2D23] text-xl">Rate Restaurant Experience</h3>
                  <p className="text-[#64748B] text-xs mt-1">
                    {ratingListing.foodType} Â· {ratingListing.restaurant?.name}
                  </p>
                </div>

                <StarPicker value={stars} onChange={setStars} />

                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">Your Review</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share feedback on food quality, packaging, or pickup experienceâ€¦"
                    className="w-full border border-[#E7E5E0] rounded-xl p-3 text-sm outline-none focus:border-[#3E5F48] focus:ring-2 focus:ring-[#3E5F48]/20 transition-all resize-none bg-[#F8F6F3]"
                    rows={3}
                  />
                </div>

                <label className="flex items-center gap-2 text-xs text-[#64748B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isComplaint}
                    onChange={(e) => setIsComplaint(e.target.checked)}
                    className="w-4 h-4 accent-[#3E5F48] rounded"
                  />
                  <span>Flag as a complaint for administrative review</span>
                </label>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setRatingListing(null)}
                    className="flex-1 border border-[#E7E5E0] rounded-xl py-2.5 text-sm font-semibold text-[#64748B] hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitRating}
                    disabled={submittingRating}
                    className="flex-1 bg-[#3E5F48] hover:bg-[#4F6A57] text-white font-semibold text-sm py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
                  >
                    {submittingRating ? 'Submittingâ€¦' : 'Submit Review'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </PageTransition>
    </NgoLayout>
  );
}

export default NgoMyPickups;



