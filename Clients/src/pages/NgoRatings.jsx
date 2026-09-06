import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NgoLayout from '../components/NgoLayout';
import PageTransition from '../components/PageTransition';
import { useToast } from '../components/ToastContext';
import {
  Star,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="text-xl transition-transform hover:scale-110 focus:outline-none"
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          {n <= value ? '⭐' : '☆'}
        </button>
      ))}
    </div>
  );
}

function NgoRatings() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [received, setReceived] = useState({ ratings: [], average: null });
  const [given, setGiven] = useState([]);
  const [pending, setPending] = useState([]);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');
  const [isComplaint, setIsComplaint] = useState(false);
  const [activePending, setActivePending] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editStars, setEditStars] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');

  useEffect(() => {
    if (!token || role !== 'ngo') { navigate('/start/login'); return; }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [r, g, p] = await Promise.all([
        axios.get('http://localhost:5000/api/ratings/received', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/ratings/given',    { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/ratings/pending',  { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setReceived(r.data || { ratings: [], average: null });
      setGiven(g.data || []);
      setPending(p.data || []);
    } catch (err) {
      console.error('Error fetching ratings:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitPending = async () => {
    setSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/ratings', {
        listingId: activePending, stars, comment, isComplaint
      }, { headers: { Authorization: `Bearer ${token}` } });
      showToast('Rating submitted successfully!', 'success');
      setActivePending(null); setStars(5); setComment(''); setIsComplaint(false);
      fetchAll();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit rating', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (r) => { setEditing(r._id); setEditStars(r.stars); setEditComment(r.comment || ''); };

  const saveEdit = async (id) => {
    setSaving(true);
    try {
      await axios.patch(`http://localhost:5000/api/ratings/${id}`, { stars: editStars, comment: editComment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Rating updated', 'success'); setEditing(null); fetchAll();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update rating', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/ratings/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      showToast('Rating deleted', 'success'); fetchAll();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete rating', 'error');
    }
  };

  // Rating Distribution Calculation
  const totalCount = received.ratings.length;
  const distribution = [5, 4, 3, 2, 1].map((s) => {
    const count = received.ratings.filter((r) => r.stars === s).length;
    const pct = totalCount ? Math.round((count / totalCount) * 100) : 0;
    return { stars: s, count, pct };
  });

  return (
    <NgoLayout>
      <PageTransition>
        <div className="space-y-8 font-sans bg-[#F8F6F3] text-[#1F2D23]">
          
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#D9A441] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-100" />
              <span>COMMUNITY REVIEWS</span>
            </div>
            <h1 className="text-[34px] font-extrabold text-[#1F2D23] tracking-tight leading-tight">
              Ratings & Reviews
            </h1>
            <p className="text-[#64748B] text-base mt-1">
              Feedback received from partner restaurants and ratings you have submitted.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Overview & Reviews Received */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Pending Reviews Queue Banner */}
              {pending.length > 0 && (
                <div className="bg-[#F7EDD6] border border-amber-200 rounded-[20px] p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#D9A441] text-white text-xs font-bold flex items-center justify-center">
                      {pending.length}
                    </span>
                    <h3 className="font-bold text-[#1F2D23] text-lg">Pending Reviews Queue</h3>
                  </div>

                  <div className="space-y-3">
                    {pending.map((l) => (
                      <div key={l._id} className="bg-white border border-[#E7E5E0] rounded-xl p-4 shadow-xs">
                        <p className="text-sm font-semibold text-[#1F2D23]">
                          {l.foodType} ({l.quantity}kg) from {l.restaurant?.name || 'Restaurant'}
                        </p>
                        {activePending === l._id ? (
                          <div className="mt-3 space-y-3">
                            <StarPicker value={stars} onChange={setStars} />
                            <textarea
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Write a feedback comment…"
                              className="w-full border border-[#E7E5E0] rounded-xl p-3 text-xs outline-none focus:border-[#3E5F48] focus:ring-2 focus:ring-[#3E5F48]/20 bg-[#F8F6F3] resize-none"
                              rows={2}
                            />
                            <label className="flex items-center gap-2 text-xs text-[#64748B] cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isComplaint}
                                onChange={(e) => setIsComplaint(e.target.checked)}
                                className="w-3.5 h-3.5 accent-[#3E5F48]"
                              />
                              <span>Flag as a complaint</span>
                            </label>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setActivePending(null)}
                                className="flex-1 border border-[#E7E5E0] rounded-xl py-2 text-xs font-semibold text-[#64748B] hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={submitPending}
                                disabled={submitting}
                                className="flex-1 bg-[#3E5F48] hover:bg-[#4F6A57] text-white font-semibold text-xs py-2 rounded-xl shadow-xs"
                              >
                                {submitting ? 'Submitting…' : 'Submit Review'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setActivePending(l._id)}
                            className="text-xs text-[#3E5F48] font-semibold hover:underline mt-2 inline-block"
                          >
                            Write a review →
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Overview Average Rating Score & Progress Bars Card */}
              <div className="bg-white border border-[#E7E5E0] rounded-[20px] p-6 shadow-xs space-y-6">
                <h3 className="text-[22px] font-bold text-[#1F2D23]">Ratings Summary</h3>

                <div className="flex flex-col sm:flex-row items-center gap-8 bg-[#F8F6F3] p-6 rounded-2xl border border-[#E7E5E0]">
                  {/* Rating Score */}
                  <div className="text-center sm:border-r border-[#E7E5E0] sm:pr-8">
                    <p className="text-5xl font-extrabold text-[#D9A441] leading-none">
                      {received.average || '4.9'}
                    </p>
                    <div className="flex gap-1 justify-center my-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(Number(received.average) || 5)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-[#64748B] font-medium">
                      Based on {received.ratings.length} verified review{received.ratings.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Distribution Progress Bars in Primary Green */}
                  <div className="flex-1 w-full space-y-2">
                    {distribution.map((d) => (
                      <div key={d.stars} className="flex items-center gap-3 text-xs">
                        <span className="w-3 text-right font-semibold text-[#1F2D23]">{d.stars}</span>
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <div className="flex-1 h-2 bg-gray-200/80 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#3E5F48] rounded-full transition-all duration-500"
                            style={{ width: `${d.pct}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-[#64748B] font-medium">{d.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Received Review Cards List */}
                <div className="space-y-4 pt-2">
                  <h4 className="font-bold text-[#1F2D23] text-base">Reviews Received</h4>
                  {received.ratings.length === 0 ? (
                    <p className="text-xs text-[#64748B] py-4 text-center">No reviews received yet.</p>
                  ) : (
                    received.ratings.map((r) => (
                      <div key={r._id} className="border-b border-[#E7E5E0] pb-4 last:border-b-0 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-[#3E5F48]" />
                            <span className="font-bold text-sm text-[#1F2D23]">
                              {r.fromId?.name || 'Verified Restaurant'}
                            </span>
                            <span className="bg-[#E2EDE5] text-[#3E5F48] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#C8D9C4]">
                              Verified Partner
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(r.createdAt || Date.now()).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < r.stars ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          {r.isComplaint && (
                            <span className="bg-amber-50 text-[#D9A441] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-500" />
                              Complaint Flagged
                            </span>
                          )}
                        </div>

                        {r.comment && (
                          <p className="text-xs text-[#64748B] leading-relaxed pt-1">{r.comment}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Right 1 Col: Ratings You've Given */}
            <div className="space-y-6">
              <div className="bg-white border border-[#E7E5E0] rounded-[20px] p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-[#1F2D23]">Ratings You've Given</h3>

                {given.length === 0 ? (
                  <p className="text-xs text-[#64748B] py-4 text-center">You haven't rated any restaurant yet.</p>
                ) : (
                  <div className="space-y-4">
                    {given.map((r) => (
                      <div key={r._id} className="p-4 rounded-xl border border-[#E7E5E0] bg-[#F8F6F3] space-y-2 text-xs">
                        {editing === r._id ? (
                          <div className="space-y-3">
                            <StarPicker value={editStars} onChange={setEditStars} />
                            <textarea
                              value={editComment}
                              onChange={(e) => setEditComment(e.target.value)}
                              className="w-full border border-[#E7E5E0] rounded-xl p-2.5 text-xs outline-none focus:border-[#3E5F48] bg-white resize-none"
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditing(null)}
                                className="flex-1 border border-[#E7E5E0] bg-white rounded-lg py-1.5 font-semibold text-[#64748B]"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => saveEdit(r._id)}
                                disabled={saving}
                                className="flex-1 bg-[#3E5F48] text-white rounded-lg py-1.5 font-semibold"
                              >
                                {saving ? 'Saving…' : 'Save'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#1F2D23]">{r.toId?.name || 'Restaurant'}</span>
                              <div className="flex gap-2">
                                <button onClick={() => startEdit(r)} className="text-[#3E5F48] font-semibold hover:underline">Edit</button>
                                <button onClick={() => handleDelete(r._id)} className="text-red-500 font-semibold hover:underline">Delete</button>
                              </div>
                            </div>

                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < r.stars ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                              ))}
                            </div>

                            {r.comment && <p className="text-[#64748B] leading-relaxed">{r.comment}</p>}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </PageTransition>
    </NgoLayout>
  );
}

export default NgoRatings;
