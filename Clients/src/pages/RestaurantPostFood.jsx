import { API_BASE_URL } from '../config/api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RestaurantLayout from '../components/RestaurantLayout';
import FoodListingCard from '../components/FoodListingCard';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import Confetti from '../components/Confetti';
import PageTransition from '../components/PageTransition';
import { useToast } from '../components/ToastContext';
import { FOOD_TYPE_ICONS, IconClock } from '../components/FoodIcons';

const FOOD_TYPES = ['Rice', 'Curry', 'Roti', 'Snacks', 'Sweets', 'Other'];
const FRESH_OPTIONS = ['1hr', '2hrs', '4hrs', '6+ hrs'];

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)} className="text-2xl transition-transform duration-150 hover:scale-110" aria-label={`${n} star${n>1?'s':''}`}>
          {n <= value ? 'â­' : 'â˜†'}
        </button>
      ))}
    </div>
  );
}

function RestaurantPostFood() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [foodType, setFoodType] = useState('Rice');
  const [quantity, setQuantity] = useState(1);
  const [freshFor, setFreshFor] = useState('2hrs');
  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [posting, setPosting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [ratingListing, setRatingListing] = useState(null);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');
  const [isComplaint, setIsComplaint] = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);

  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');

  useEffect(() => {
    if (!token || role !== 'restaurant') { navigate('/start/login'); return; }
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/listings/mine`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setListings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingListings(false);
    }
  };

  const handlePost = async () => {
    setPosting(true);
    try {
      await axios.post(`${API_BASE_URL}/api/listings`, { foodType, quantity, freshFor }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuantity(1);
      fetchListings();
      setShowConfetti(true);
      setShowThanks(true);
      setTimeout(() => setShowConfetti(false), 1400);
      setTimeout(() => setShowThanks(false), 3200);
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/listings/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      showToast('Listing deleted', 'success');
      fetchListings();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete', 'error');
    }
  };

  const submitRating = async () => {
    setSubmittingRating(true);
    try {
      await axios.post(`${API_BASE_URL}/api/ratings`, {
        listingId: ratingListing._id, stars, comment, isComplaint
      }, { headers: { Authorization: `Bearer ${token}` } });
      showToast('Rating submitted!', 'success');
      setRatingListing(null);
      setStars(5); setComment(''); setIsComplaint(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit rating', 'error');
    } finally {
      setSubmittingRating(false);
    }
  };

  const peopleFed = Math.round(quantity / 0.25);

  return (
    <RestaurantLayout>
      <PageTransition>
        {showConfetti && <Confetti />}

        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-ink mb-1">Post Surplus Food</h1>
          <p className="text-ink-soft text-sm">A few taps â€” and your food helps someone today.</p>
        </div>

        {/* Success banner */}
        {showThanks && (
          <div className="fade-in-up mb-6 bg-gradient-to-r from-primary-light to-primary-light/50 border border-primary/30 rounded-2xl px-5 py-4 flex items-center gap-3 max-w-2xl">
            <span className="text-2xl">ðŸŽ‰</span>
            <div>
              <p className="text-primary-dark font-bold text-sm">Listing posted successfully!</p>
              <p className="text-primary-dark/70 text-xs mt-0.5">Thank you for donating food. You're making a real difference. ðŸ’š</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl">
          {/* Form card */}
          <div className="bg-white border border-gray-100 shadow-fb-card rounded-2xl p-6">
            {/* Food type */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-ink mb-3">Food Type</label>
              <div className="grid grid-cols-3 gap-2">
                {FOOD_TYPES.map((type) => {
                  const Icon = FOOD_TYPE_ICONS[type];
                  const active = foodType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setFoodType(type)}
                      className={`flex flex-col items-center gap-1.5 py-3.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                        active
                          ? 'bg-primary text-white shadow-md scale-[1.02]'
                          : 'bg-fb-gradient text-ink-soft hover:bg-primary-light/60 hover:text-primary-dark'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-ink mb-3">Quantity (kg)</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(q => Math.max(0.5, q - 0.5))}
                  className="w-11 h-11 rounded-xl bg-fb-gradient hover:bg-primary-light text-xl font-bold text-primary transition-all duration-150 hover:scale-105 active:scale-95 border border-gray-100 shadow-sm"
                >
                  âˆ’
                </button>
                <div className="flex-1 text-center">
                  <p className="text-2xl font-black text-ink">{quantity} kg</p>
                  <p className="text-xs text-primary-dark font-medium mt-0.5">~{peopleFed} people fed</p>
                </div>
                <button
                  onClick={() => setQuantity(q => q + 0.5)}
                  className="w-11 h-11 rounded-xl bg-fb-gradient hover:bg-primary-light text-xl font-bold text-primary transition-all duration-150 hover:scale-105 active:scale-95 border border-gray-100 shadow-sm"
                >
                  +
                </button>
              </div>
              {/* Visual bar */}
              <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (quantity / 20) * 100)}%` }} />
              </div>
            </div>

            {/* Freshness */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-ink mb-3">Stays Fresh For</label>
              <div className="grid grid-cols-4 gap-2">
                {FRESH_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFreshFor(opt)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      freshFor === opt
                        ? 'bg-secondary text-white shadow-md scale-[1.02]'
                        : 'bg-fb-gradient text-ink-soft hover:bg-secondary-light hover:text-secondary-dark'
                    }`}
                  >
                    <IconClock className="w-4 h-4" />
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <Button variant="primary" loading={posting} onClick={handlePost} className="w-full glow-green" size="lg">
              {posting ? 'Postingâ€¦' : 'Post Listing ðŸ½ï¸'}
            </Button>
          </div>

          {/* My active listings */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-ink">My Active Listings</h2>
              {listings.length > 0 && (
                <span className="text-xs bg-primary-light text-primary-dark px-2.5 py-1 rounded-full font-semibold">{listings.length}</span>
              )}
            </div>

            {loadingListings ? (
              <div className="flex items-center gap-2 text-ink-soft text-sm py-8">
                <Spinner size={18} /> Loadingâ€¦
              </div>
            ) : listings.length === 0 ? (
              <div className="bg-white border border-gray-100 shadow-fb-card rounded-2xl p-8 text-center">
                <p className="text-ink-soft text-sm">No listings yet â€” post your first one!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                {listings.map((l) => (
                  <FoodListingCard
                    key={l._id}
                    listing={l}
                    accent="primary"
                    statusBadge={l.status}
                    footer={
                      <div className="flex items-center gap-2">
                        {l.status === 'Picked Up' && (
                          <button
                            onClick={() => setRatingListing(l)}
                            className="flex-1 text-xs text-primary hover:underline font-semibold py-1.5"
                          >
                            Rate NGO
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(l._id)}
                          className="flex-1 text-xs text-red-500 hover:underline py-1.5 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rating Modal */}
        {ratingListing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-3xl p-7 w-full max-w-sm fade-in-up shadow-premium">
              <h3 className="font-extrabold text-ink text-lg mb-1">Rate this NGO</h3>
              <p className="text-ink-soft text-sm mb-5">{ratingListing.foodType} Â· {ratingListing.quantity}kg</p>
              <StarPicker value={stars} onChange={setStars} />
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Optional commentâ€¦"
                className="w-full border border-gray-200 rounded-xl p-3 text-sm mt-4 mb-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 resize-none" rows={3} />
              <label className="flex items-center gap-2.5 text-sm text-ink-soft mb-5 cursor-pointer">
                <input type="checkbox" checked={isComplaint} onChange={(e) => setIsComplaint(e.target.checked)} className="w-4 h-4 accent-primary" />
                Flag as a complaint
              </label>
              <div className="flex gap-3">
                <button onClick={() => setRatingListing(null)} className="flex-1 border border-gray-200 rounded-full py-2.5 text-sm hover:bg-gray-50 transition-colors font-medium">Cancel</button>
                <Button variant="primary" loading={submittingRating} onClick={submitRating} className="flex-1">Submit</Button>
              </div>
            </div>
          </div>
        )}
      </PageTransition>
    </RestaurantLayout>
  );
}

export default RestaurantPostFood;


