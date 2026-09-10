import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import RestaurantLayout from '../components/RestaurantLayout';
import NgoLayout from '../components/NgoLayout';
import PageTransition from '../components/PageTransition';
import { useToast } from '../components/ToastContext';
import ComplaintModal from '../components/ComplaintModal';
import {
  Truck,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Building2,
  Phone
} from 'lucide-react';

const STAGES = [
  { id: 'Notified', label: 'Food Ready', desc: 'Surplus food prepared & packaged' },
  { id: 'Claimed', label: 'Claimed by NGO', desc: 'Reserved for distribution' },
  { id: 'Out for Pickup', label: 'Out for Pickup', desc: 'Driver en route to restaurant' },
  { id: 'Picked Up', label: 'Handover Completed', desc: 'Verified & safely collected' }
];

export default function PickupTracker({ role }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history'
  const [verifyingId, setVerifyingId] = useState(null);
  const [enteredPins, setEnteredPins] = useState({});
  const [startingPickupId, setStartingPickupId] = useState(null);
  const [etaValue, setEtaValue] = useState('20 mins');
  const [vehicleValue, setVehicleValue] = useState('Van / Tempo');
  const [complaintListing, setComplaintListing] = useState(null);

  const token = localStorage.getItem('token');
  const userRole = role || localStorage.getItem('role');

  const Layout = userRole === 'restaurant' ? RestaurantLayout : NgoLayout;

  useEffect(() => {
    if (!token) {
      navigate('/start');
      return;
    }
    fetchTrackedPickups();
    const interval = setInterval(fetchTrackedPickups, 8000);
    return () => clearInterval(interval);
  }, []);

  const fetchTrackedPickups = async () => {
    try {
      const res = await axios.get('/api/listings/active-tracked', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPickups(res.data || []);
    } catch (err) {
      console.error('Error fetching active pickups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartPickup = async (listingId) => {
    try {
      await axios.post(`/api/listings/${listingId}/start-pickup`, {
        estimatedArrival: etaValue,
        vehicleType: vehicleValue
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Status updated to Out for Pickup! Drive safely. 🚚', 'success');
      setStartingPickupId(null);
      fetchTrackedPickups();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update pickup status', 'error');
    }
  };

  const handleVerifyPin = async (listingId) => {
    const pin = enteredPins[listingId];
    if (!pin || pin.trim().length !== 4) {
      showToast('Please enter the 4-digit PIN provided by the driver.', 'error');
      return;
    }

    setVerifyingId(listingId);
    try {
      await axios.post(`/api/listings/${listingId}/verify-pin`, {
        pin: pin.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Pickup verified successfully! Food handed over. 🎉', 'success');
      setEnteredPins({ ...enteredPins, [listingId]: '' });
      fetchTrackedPickups();
    } catch (err) {
      showToast(err.response?.data?.message || 'Incorrect PIN. Please re-check.', 'error');
    } finally {
      setVerifyingId(null);
    }
  };

  const getStageIndex = (status) => {
    if (status === 'Notified') return 0;
    if (status === 'Claimed') return 1;
    if (status === 'Out for Pickup') return 2;
    if (status === 'Picked Up') return 3;
    return 0;
  };

  const activePickups = pickups.filter(p => p.status !== 'Picked Up' && p.status !== 'Expired');
  const completedPickups = pickups.filter(p => p.status === 'Picked Up');
  const displayedList = activeTab === 'active' ? activePickups : completedPickups;

  return (
    <Layout>
      <PageTransition>
        <div className="space-y-6 font-sans text-ink">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#D9A441] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2 shadow-xs">
                <Truck className="w-3.5 h-3.5" />
                <span>Live Operations</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
                Food Pickup Status Tracker
              </h1>
              <p className="text-xs sm:text-sm text-ink-soft mt-0.5">
                Real-time tracking of surplus food collection with 4-digit verification PIN.
              </p>
            </div>

            {/* Quick Refresh */}
            <button
              onClick={fetchTrackedPickups}
              className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-ink-soft hover:text-ink transition-colors shadow-xs flex items-center gap-1.5 text-xs font-semibold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'active'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-white border border-[#E7E5E0] text-gray-600 hover:bg-gray-50'
              }`}
            >
              Live Pickups ({activePickups.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-white border border-[#E7E5E0] text-gray-600 hover:bg-gray-50'
              }`}
            >
              Completed Pickups ({completedPickups.length})
            </button>
          </div>

          {/* Loading or Empty state */}
          {loading && displayedList.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-500 bg-white rounded-3xl border border-[#E7E5E0]">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
              Loading pickup tracker…
            </div>
          ) : displayedList.length === 0 ? (
            <div className="bg-white border border-[#E7E5E0] rounded-3xl p-12 text-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-ink text-base mb-1">
                {activeTab === 'active' ? 'No active pickups in progress' : 'No completed pickups yet'}
              </h3>
              <p className="text-xs text-ink-soft max-w-sm mx-auto mb-4">
                {userRole === 'restaurant'
                  ? 'When an NGO claims your posted surplus food, live tracking and the verification PIN will appear here.'
                  : 'Browse surplus food listings and claim a batch to start live pickup tracking.'}
              </p>
              <Link
                to={userRole === 'restaurant' ? '/restaurant/post' : '/ngo/browse'}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:opacity-95"
              >
                <span>{userRole === 'restaurant' ? 'Post Food' : 'Browse Food Listings'}</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {displayedList.map((p) => {
                const currentStage = getStageIndex(p.status);
                const isNgo = userRole === 'ngo';
                const isRestaurant = userRole === 'restaurant';
                const partnerName = isNgo ? (p.restaurant?.name || 'Restaurant') : (p.claimedBy?.name || 'NGO Partner');
                const partnerLocation = isNgo ? p.restaurant?.location : p.claimedBy?.location;

                return (
                  <div
                    key={p._id}
                    className="bg-white border border-[#E7E5E0] rounded-3xl p-6 sm:p-7 shadow-xs hover:border-gray-300 transition-all space-y-6"
                  >
                    {/* Header Row */}
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-base font-black text-ink">{p.foodType}</span>
                          <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                            {p.quantity} kg
                          </span>
                          <span className="text-xs bg-amber-50 text-amber-800 font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                            Feeds ~{p.peopleFed || Math.round(p.quantity / 0.25)} people
                          </span>
                        </div>
                        <p className="text-xs text-ink-soft">
                          Partner: <strong className="text-ink">{partnerName}</strong> · Location: {partnerLocation || 'City Center'}
                        </p>
                      </div>

                      {/* Status Tag */}
                      <div className="text-right">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold shadow-xs ${
                          p.status === 'Picked Up'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : p.status === 'Out for Pickup'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                            : 'bg-blue-100 text-blue-900 border border-blue-300'
                        }`}>
                          <span className="w-2 h-2 rounded-full bg-current" />
                          {p.status}
                        </span>
                        {p.freshFor && (
                          <p className="text-[11px] text-gray-400 mt-1 flex items-center justify-end gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Fresh for: {p.freshFor}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 4-Stage Stepper Progress Bar */}
                    <div className="py-2">
                      <div className="flex items-center justify-between relative">
                        {STAGES.map((s, idx) => {
                          const isDone = currentStage >= idx;
                          const isCurrent = currentStage === idx;

                          return (
                            <div key={s.id} className="flex-1 flex flex-col items-center text-center relative z-10">
                              {/* Connecting line */}
                              {idx > 0 && (
                                <div
                                  className={`absolute top-4 -left-1/2 w-full h-1 -z-10 transition-colors duration-300 ${
                                    currentStage >= idx ? 'bg-primary' : 'bg-gray-200'
                                  }`}
                                />
                              )}

                              {/* Circle icon */}
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all shadow-xs ${
                                isDone
                                  ? 'bg-primary text-white ring-4 ring-primary/15'
                                  : 'bg-gray-100 text-gray-400'
                              }`}>
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                  idx + 1
                                )}
                              </div>

                              {/* Stage labels */}
                              <p className={`text-xs mt-2 font-bold leading-tight ${isCurrent ? 'text-primary font-black' : isDone ? 'text-ink' : 'text-gray-400'}`}>
                                {s.label}
                              </p>
                              <p className="text-[10px] text-gray-400 hidden sm:block max-w-[110px] mt-0.5">
                                {s.desc}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Operational Actions Area (PIN Display / PIN Input) */}
                    <div className="bg-[#FAF9F6] border border-[#E7E5E0] rounded-2xl p-4 sm:p-5 space-y-4">
                      
                      {/* For NGO: Display 4-digit PIN */}
                      {isNgo && p.pickupPin && (
                        <div className="flex flex-wrap items-center justify-between gap-4 bg-amber-50/80 border border-amber-200 rounded-2xl p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-[#D9A441] text-white flex items-center justify-center font-black shadow-xs flex-shrink-0">
                              <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                                4-Digit Pickup Verification PIN
                              </span>
                              <p className="text-xs text-amber-800">
                                Give this code to the restaurant at the kitchen door upon collection:
                              </p>
                            </div>
                          </div>
                          <div className="px-5 py-2 rounded-xl bg-white border-2 border-[#D9A441] shadow-xs text-center">
                            <span className="text-2xl font-black tracking-widest text-[#1F2D23] font-mono">
                              {p.pickupPin}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* For NGO: Mark Out for Pickup Button */}
                      {isNgo && p.status === 'Claimed' && (
                        <div>
                          {startingPickupId === p._id ? (
                            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                              <h4 className="text-xs font-bold uppercase tracking-wide text-ink">
                                Start Pickup — Departure Details
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-xs text-gray-500 block mb-1">Estimated Arrival Time</label>
                                  <select
                                    value={etaValue}
                                    onChange={(e) => setEtaValue(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold bg-white"
                                  >
                                    <option value="10-15 mins">10-15 mins</option>
                                    <option value="20-30 mins">20-30 mins</option>
                                    <option value="45 mins">45 mins</option>
                                    <option value="1 hour">1 hour</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500 block mb-1">Transport Vehicle</label>
                                  <select
                                    value={vehicleValue}
                                    onChange={(e) => setVehicleValue(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold bg-white"
                                  >
                                    <option value="Van / Tempo">Van / Tempo</option>
                                    <option value="Auto / Car">Auto / Car</option>
                                    <option value="Two-Wheeler">Two-Wheeler</option>
                                    <option value="On Foot">On Foot</option>
                                  </select>
                                </div>
                              </div>
                              <div className="flex gap-2 justify-end pt-1">
                                <button
                                  onClick={() => setStartingPickupId(null)}
                                  className="px-3 py-1.5 rounded-xl border text-xs font-semibold text-gray-600 hover:bg-gray-50"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleStartPickup(p._id)}
                                  className="px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:opacity-90"
                                >
                                  Confirm & Start Trip 🚚
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setStartingPickupId(p._id)}
                              className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-xs hover:bg-[#4F6A57] transition-all flex items-center justify-center gap-2"
                            >
                              <Truck className="w-4 h-4" />
                              <span>Start Pickup / En Route to Restaurant</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* For Restaurant: PIN Verification Input */}
                      {isRestaurant && ['Claimed', 'Out for Pickup'].includes(p.status) && (
                        <div className="bg-white border border-emerald-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            <h4 className="text-sm font-bold text-ink">
                              Driver Handover Verification
                            </h4>
                          </div>
                          <p className="text-xs text-ink-soft">
                            Ask the {p.claimedBy?.name || 'NGO'} driver for their 4-digit Pickup PIN and enter it below to confirm collection:
                          </p>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              maxLength={4}
                              placeholder="4-digit PIN"
                              value={enteredPins[p._id] || ''}
                              onChange={(e) => setEnteredPins({ ...enteredPins, [p._id]: e.target.value })}
                              className="w-36 text-center tracking-widest text-lg font-black font-mono border-2 border-gray-200 rounded-xl py-2 px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                            <button
                              onClick={() => handleVerifyPin(p._id)}
                              disabled={verifyingId === p._id}
                              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-primary hover:bg-[#4F6A57] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                              {verifyingId === p._id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4" />
                              )}
                              <span>Verify PIN & Hand Over Food</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* En Route Indicator */}
                      {p.status === 'Out for Pickup' && (
                        <div className="flex items-center gap-2 text-xs bg-amber-50 text-amber-900 border border-amber-200 p-3 rounded-xl">
                          <Truck className="w-4 h-4 text-amber-700 animate-bounce" />
                          <span>
                            Driver is en route{p.estimatedArrival ? ` (Estimated Arrival: ${p.estimatedArrival})` : ''}{p.vehicleType ? ` via ${p.vehicleType}` : ''}.
                          </span>
                        </div>
                      )}

                      {/* Handover Completed Banner */}
                      {p.status === 'Picked Up' && (
                        <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-900 border border-emerald-200 p-3 rounded-xl font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>
                            Food collection verified & completed on {p.pickedUpAt ? new Date(p.pickedUpAt).toLocaleString() : 'today'}. Thank you for preventing food waste!
                          </span>
                        </div>
                      )}

                      {/* Bottom Help & Report Issue link */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-gray-400">Batch ID: #{p._id.slice(-6)}</span>
                        <button
                          type="button"
                          onClick={() => setComplaintListing(p)}
                          className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 hover:underline"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Report Issue with Pickup</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Issue Reporting Modal */}
          <ComplaintModal
            isOpen={!!complaintListing}
            onClose={() => setComplaintListing(null)}
            listing={complaintListing}
            onSubmitted={() => fetchTrackedPickups()}
          />
        </div>
      </PageTransition>
    </Layout>
  );
}
