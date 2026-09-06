import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RestaurantLayout from '../components/RestaurantLayout';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';
import { useToast } from '../components/ToastContext';

function StarRow({ count, value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)} className="text-xl transition-transform hover:scale-110">
          {n <= value ? '⭐' : '☆'}
        </button>
      ))}
    </div>
  );
}

function RatingCard({ r, onEdit, onDelete }) {
  return (
    <div className="card-hover bg-white border border-gray-100 shadow-fb-card rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex gap-0.5 mb-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-sm ${i < r.stars ? 'text-secondary' : 'text-gray-200'}`}>★</span>
            ))}
          </div>
          {r.isComplaint && (
            <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-semibold">Complaint</span>
          )}
        </div>
        <div className="flex gap-2">
          {onEdit && <button onClick={onEdit} className="text-xs text-primary hover:underline font-medium">Edit</button>}
          {onDelete && <button onClick={onDelete} className="text-xs text-red-500 hover:underline font-medium">Delete</button>}
        </div>
      </div>
      {r.comment && <p className="text-sm text-ink-soft mt-2 leading-relaxed">{r.comment}</p>}
      <p className="text-xs text-ink-soft/60 mt-2">
        {r.fromId?.name || r.toId?.name} · {r.listing?.foodType} · {new Date(r.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}

function RestaurantRatings() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [received, setReceived]   = useState({ ratings: [], average: null });
  const [given, setGiven]         = useState([]);
  const [pending, setPending]     = useState([]);
  const [stars, setStars]         = useState(5);
  const [comment, setComment]     = useState('');
  const [isComplaint, setIsComplaint] = useState(false);
  const [activePending, setActivePending] = useState(null);
  const [editing, setEditing]     = useState(null);
  const [editStars, setEditStars] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving]       = useState(false);
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');

  useEffect(() => {
    if (!token || role !== 'restaurant') { navigate('/start/login'); return; }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [r, g, p] = await Promise.all([
      axios.get('http://localhost:5000/api/ratings/received', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('http://localhost:5000/api/ratings/given',    { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('http://localhost:5000/api/ratings/pending',  { headers: { Authorization: `Bearer ${token}` } }),
    ]);
    setReceived(r.data); setGiven(g.data); setPending(p.data);
  };

  const submitPending = async () => {
    setSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/ratings', {
        listingId: activePending, stars, comment, isComplaint
      }, { headers: { Authorization: `Bearer ${token}` } });
      showToast('Rating submitted!', 'success');
      setActivePending(null); setStars(5); setComment(''); setIsComplaint(false);
      fetchAll();
    } catch (err) { showToast(err.response?.data?.message || 'Failed to submit', 'error'); }
    finally { setSubmitting(false); }
  };

  const startEdit = (r) => { setEditing(r._id); setEditStars(r.stars); setEditComment(r.comment); };

  const saveEdit = async (id) => {
    setSaving(true);
    try {
      await axios.patch(`http://localhost:5000/api/ratings/${id}`, { stars: editStars, comment: editComment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Rating updated', 'success'); setEditing(null); fetchAll();
    } catch (err) { showToast(err.response?.data?.message || 'Failed to update', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/ratings/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      showToast('Rating deleted', 'success'); fetchAll();
    } catch (err) { showToast(err.response?.data?.message || 'Failed to delete', 'error'); }
  };

  // Distribution
  const distribution = [5,4,3,2,1].map(s => ({
    stars: s,
    count: received.ratings.filter(r => r.stars === s).length,
    pct: received.ratings.length
      ? Math.round((received.ratings.filter(r => r.stars === s).length / received.ratings.length) * 100)
      : 0,
  }));

  return (
    <RestaurantLayout>
      <PageTransition>
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-ink mb-1">Ratings & Reviews</h1>
          <p className="text-ink-soft text-sm">What NGOs have said about you, and your reviews for them.</p>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Pending reviews */}
          {pending.length > 0 && (
            <div className="bg-[#F7EDD6]/60 border border-[#E7E5E0] rounded-[20px] p-6 shadow-xs">
              <h2 className="font-bold text-ink mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#D9A441] text-white text-xs font-bold flex items-center justify-center">{pending.length}</span>
                Pending Reviews
              </h2>
              <div className="flex flex-col gap-3">
                {pending.map((l) => (
                  <div key={l._id} className="bg-white border border-gray-100 rounded-xl p-4">
                    <p className="text-sm font-semibold text-ink mb-2">
                      {l.foodType} — {l.quantity}kg, claimed by {l.claimedBy?.name}
                    </p>
                    {activePending === l._id ? (
                      <>
                        <StarRow value={stars} onChange={setStars} />
                        <textarea value={comment} onChange={e => setComment(e.target.value)}
                          placeholder="Optional comment…"
                          className="w-full border border-gray-200 rounded-xl p-2.5 text-sm mt-3 mb-2 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none" rows={2} />
                        <label className="flex items-center gap-2 text-xs text-ink-soft mb-3 cursor-pointer">
                          <input type="checkbox" checked={isComplaint} onChange={e => setIsComplaint(e.target.checked)} className="w-3.5 h-3.5 accent-primary" />
                          This is a complaint
                        </label>
                        <div className="flex gap-2">
                          <button onClick={() => setActivePending(null)} className="flex-1 border border-gray-200 rounded-full py-1.5 text-xs hover:bg-gray-50 font-medium">Cancel</button>
                          <Button variant="primary" loading={submitting} onClick={submitPending} className="flex-1 !py-1.5 !text-xs">Submit</Button>
                        </div>
                      </>
                    ) : (
                      <button onClick={() => setActivePending(l._id)} className="text-xs text-primary font-semibold hover:underline">
                        Write a review →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ratings received */}
          <div className="bg-white border border-gray-100 shadow-fb-card rounded-2xl p-6">
            <h2 className="font-bold text-ink mb-4">Ratings Received</h2>

            {received.ratings.length === 0 ? (
              <p className="text-ink-soft text-sm">No ratings received yet.</p>
            ) : (
              <>
                {/* Overview */}
                <div className="flex items-center gap-6 mb-5 p-4 bg-fb-gradient rounded-xl">
                  <div className="text-center">
                    <p className="text-5xl font-black text-primary leading-none">{received.average || '—'}</p>
                    <div className="flex gap-0.5 justify-center mt-1">
                      {[...Array(5)].map((_,i) => (
                        <span key={i} className={`text-sm ${i < Math.round(received.average||0) ? 'text-secondary' : 'text-gray-200'}`}>★</span>
                      ))}
                    </div>
                    <p className="text-xs text-ink-soft mt-1">{received.ratings.length} review{received.ratings.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {distribution.map(d => (
                      <div key={d.stars} className="flex items-center gap-2 text-xs">
                        <span className="text-ink-soft w-4 text-right">{d.stars}</span>
                        <span className="text-secondary text-[10px]">★</span>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-secondary rounded-full progress-grow" style={{ width: `${d.pct}%` }} />
                        </div>
                        <span className="text-ink-soft w-6">{d.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {received.ratings.map((r) => (
                    <RatingCard key={r._id} r={{ ...r, fromId: r.fromId }} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Ratings given */}
          <div>
            <h2 className="text-lg font-bold text-ink mb-4">Ratings You've Given</h2>
            {given.length === 0 ? (
              <div className="bg-white border border-gray-100 shadow-fb-card rounded-xl p-6 text-center">
                <p className="text-ink-soft text-sm">You haven't rated any NGO yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {given.map((r) => (
                  <div key={r._id} className="card-hover bg-white border border-gray-100 shadow-fb-card rounded-xl p-4">
                    {editing === r._id ? (
                      <>
                        <StarRow value={editStars} onChange={setEditStars} />
                        <textarea value={editComment} onChange={e => setEditComment(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl p-2.5 text-sm mt-3 mb-2 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none" rows={2} />
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => setEditing(null)} className="flex-1 border border-gray-200 rounded-full py-1.5 text-xs hover:bg-gray-50 font-medium">Cancel</button>
                          <Button variant="primary" loading={saving} onClick={() => saveEdit(r._id)} className="flex-1 !py-1.5 !text-xs">Save</Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_,i) => (
                              <span key={i} className={`text-sm ${i < r.stars ? 'text-secondary' : 'text-gray-200'}`}>★</span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => startEdit(r)} className="text-xs text-primary hover:underline font-medium">Edit</button>
                            <button onClick={() => handleDelete(r._id)} className="text-xs text-red-500 hover:underline font-medium">Delete</button>
                          </div>
                        </div>
                        {r.comment && <p className="text-sm text-ink-soft mt-2">{r.comment}</p>}
                        <p className="text-xs text-ink-soft/60 mt-1">To {r.toId?.name} · {r.listing?.foodType}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </RestaurantLayout>
  );
}

export default RestaurantRatings;
