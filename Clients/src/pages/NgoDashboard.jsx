import { API_BASE_URL } from '../config/api';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import NgoLayout from '../components/NgoLayout';
import PageTransition from '../components/PageTransition';
import {
  Search,
  Truck,
  Bell,
  Heart,
  CheckCircle2,
  MapPin,
  Clock,
  ArrowRight,
  RefreshCw,
  UtensilsCrossed,
  Sparkles,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

function timeAgo(dateStr) {
  if (!dateStr) return 'Recently';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function NgoDashboard() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');
  const name  = localStorage.getItem('name') || 'NGO Partner';

  const fetchData = async () => {
    if (!token || role !== 'ngo') {
      navigate('/start/login');
      return;
    }

    try {
      const [listingsRes, pickupsRes, notifsRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/api/listings/available`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/api/listings/my-pickups`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/api/notifications/mine`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (listingsRes.status === 'fulfilled') setListings(listingsRes.value.data || []);
      if (pickupsRes.status === 'fulfilled') setPickups(pickupsRes.value.data || []);
      if (notifsRes.status === 'fulfilled') setNotifications(notifsRes.value.data || []);
    } catch (err) {
      console.error('Error fetching NGO dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const activePickups = pickups.filter((p) => p.status === 'Claimed');
  const completedPickups = pickups.filter((p) => p.status === 'Picked Up');
  
  // Calculate total people fed
  const totalKg = pickups.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
  const peopleFed = totalKg > 0 ? Math.round(totalKg * 4) : 0;

  const urgentListings = listings.slice(0, 4);
  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <NgoLayout>
      <PageTransition>
        <div className="space-y-8 font-sans bg-[#F8F6F3] text-[#1F2D23]">
          
          {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ HERO SECTION (ONE CONTINUOUS WARM BEIGE â†’ LIGHT OLIVE â†’ CREAM GRADIENT) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div
            className="relative min-h-[180px] border border-[#E7E5E0] rounded-[20px] p-6 md:p-8 flex flex-col justify-between overflow-hidden shadow-xs"
            style={{ background: 'linear-gradient(135deg, #E8DDD9 0%, #F4F2EB 50%, #DCD7C3 100%)' }}
          >
            {/* Subtle blurred circular background shapes */}
            <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-[#7E9B7A]/15 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 right-1/3 w-60 h-60 rounded-full bg-[#D9A441]/10 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-[#D9A441] text-white text-xs font-semibold px-3 py-1 rounded-full tracking-wider uppercase mb-3 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-100" />
                <span>NGO COMMUNITY DASHBOARD</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#1F2D23] tracking-tight leading-snug">
                Hello, {name} ðŸ‘‹
              </h1>
              <p className="text-[#6B7280] text-sm mt-1 max-w-xl font-normal">
                Manage food pickups and surplus donations near your location efficiently.
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap items-center gap-2.5 sm:gap-3 mt-4 sm:mt-5">
              <Link
                to="/ngo/browse"
                className="w-full sm:w-auto justify-center bg-gradient-to-r from-[#4A7C59] to-[#3E5F48] text-white hover:opacity-95 font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-full shadow-xs transition-all duration-150 active:scale-95 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Browse Listings</span>
              </Link>
              <Link
                to="/ngo/pickups"
                className="w-full sm:w-auto justify-center bg-white border border-[#3E5F48] text-[#3E5F48] hover:bg-[#3E5F48] hover:text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-full shadow-xs transition-all duration-150 active:scale-95 flex items-center gap-2"
              >
                <Truck className="w-4 h-4" />
                <span>My Pickups</span>
              </Link>
            </div>
          </div>

          {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ STATISTICS CARDS (WHITE CARDS WITH BRAND ICON CIRCLES) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Card 1: Available Listings */}
            <div className="bg-white border border-[#E7E5E0] rounded-[20px] p-6 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-[#E8F0E8] text-[#3E5F48] flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <span className="bg-[#E8F0E8] text-[#3E5F48] text-xs font-semibold px-2.5 py-1 rounded-full">
                  Live Now
                </span>
              </div>
              <div>
                <p className="text-[30px] font-extrabold text-[#1F2D23] leading-tight">
                  {listings.length}
                </p>
                <p className="text-sm font-medium text-[#64748B] mt-1">Available Listings</p>
              </div>
            </div>

            {/* Card 2: Active Pickups */}
            <div className="bg-white border border-[#E7E5E0] rounded-[20px] p-6 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-[#D9A441] flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <span className="bg-amber-50 text-[#D9A441] text-xs font-semibold px-2.5 py-1 rounded-full">
                  In Progress
                </span>
              </div>
              <div>
                <p className="text-[30px] font-extrabold text-[#1F2D23] leading-tight">
                  {activePickups.length}
                </p>
                <p className="text-sm font-medium text-[#64748B] mt-1">Active Pickups</p>
              </div>
            </div>

            {/* Card 3: People Fed */}
            <div className="bg-white border border-[#E7E5E0] rounded-[20px] p-6 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Heart className="w-6 h-6 fill-orange-100 text-orange-600" />
                </div>
                <span className="bg-orange-50 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Impact
                </span>
              </div>
              <div>
                <p className="text-[30px] font-extrabold text-[#1F2D23] leading-tight">
                  {peopleFed > 0 ? `${peopleFed.toLocaleString()}+` : '0'}
                </p>
                <p className="text-sm font-medium text-[#64748B] mt-1">People Fed</p>
              </div>
            </div>

            {/* Card 4: Completed Pickups */}
            <div className="bg-white border border-[#E7E5E0] rounded-[20px] p-6 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-[#E8F0E8] text-[#3E5F48] flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <span className="bg-[#E8F0E8] text-[#3E5F48] text-xs font-semibold px-2.5 py-1 rounded-full">
                  Delivered
                </span>
              </div>
              <div>
                <p className="text-[30px] font-extrabold text-[#1F2D23] leading-tight">
                  {completedPickups.length}
                </p>
                <p className="text-sm font-medium text-[#64748B] mt-1">Completed Pickups</p>
              </div>
            </div>
          </section>

          {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ QUICK ACTIONS SECTION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <section>
            <h2 className="text-[22px] font-extrabold text-[#1F2D23] mb-4 tracking-tight">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1 */}
              <Link
                to="/ngo/browse"
                className="group bg-white border border-[#E7E5E0] rounded-[20px] p-6 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#E8F0E8] text-[#3E5F48] flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                    <Search className="w-5.5 h-5.5" />
                  </div>
                  <h3 className="text-base font-bold text-[#1F2D23] mb-1 group-hover:text-[#3E5F48] transition-colors">
                    Browse Listings
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    Find and claim surplus food donations nearby.
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-[#3E5F48] group-hover:gap-2.5 transition-all">
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>

              {/* Card 2 */}
              <Link
                to="/ngo/pickups"
                className="group bg-white border border-[#E7E5E0] rounded-[20px] p-6 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-[#D9A441] flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                    <Truck className="w-5.5 h-5.5" />
                  </div>
                  <h3 className="text-base font-bold text-[#1F2D23] mb-1 group-hover:text-[#D9A441] transition-colors">
                    My Pickups
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    Track active claims and confirm completed pickups.
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-[#D9A441] group-hover:gap-2.5 transition-all">
                  <span>Track Pickups</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>

              {/* Card 3 */}
              <Link
                to="/ngo/notifications"
                className="group bg-white border border-[#E7E5E0] rounded-[20px] p-6 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#E8F0E8] text-[#3E5F48] flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                    <Bell className="w-5.5 h-5.5" />
                  </div>
                  <h3 className="text-base font-bold text-[#1F2D23] mb-1 group-hover:text-[#3E5F48] transition-colors">
                    Notifications
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    View real-time alerts and community updates.
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-[#3E5F48] group-hover:gap-2.5 transition-all">
                  <span>View Alerts</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </section>

          {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ MAIN CONTENT & SIDE WIDGETS GRID â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (2 Cols): Urgent Food Donations Nearby */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-[22px] font-extrabold text-[#1F2D23] tracking-tight">
                    Urgent Food Donations Nearby
                  </h2>
                  <span className="bg-[#F7EDD6] text-[#D9A441] border border-amber-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Urgent
                  </span>
                </div>
                {listings.length > 0 && (
                  <Link
                    to="/ngo/browse"
                    className="text-xs font-semibold text-[#3E5F48] hover:text-emerald-700 flex items-center gap-1"
                  >
                    <span>View All ({listings.length})</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>

              {/* Listings Grid / Empty State */}
              {listings.length === 0 ? (
                /* Polished Empty State */
                <div className="bg-white border border-[#E7E5E0] rounded-[20px] p-8 md:p-12 text-center shadow-xs flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#E8F0E8] text-[#3E5F48] flex items-center justify-center mb-4">
                    <UtensilsCrossed className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1F2D23] mb-2">
                    No food listings available right now
                  </h3>
                  <p className="text-sm text-[#64748B] max-w-md mx-auto mb-6 leading-relaxed">
                    Food listings will appear here as soon as nearby restaurants post surplus meals. Check back shortly or refresh below.
                  </p>
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="bg-[#3E5F48] hover:bg-[#4F6A57] text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all duration-150 active:scale-95 flex items-center gap-2 disabled:opacity-60"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>{refreshing ? 'Refreshingâ€¦' : 'Refresh Listings'}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {urgentListings.map((listing) => {
                    const isUrgentFreshness = listing.freshFor && (listing.freshFor.includes('1') || listing.freshFor.includes('2'));
                    return (
                      <div
                        key={listing._id}
                        className="bg-white border border-[#E7E5E0] rounded-[20px] p-5 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                      >
                        <div>
                          {/* Top Row: Food type & Badges */}
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <h3 className="font-bold text-[#1F2D23] text-base group-hover:text-[#3E5F48] transition-colors leading-snug">
                              {listing.foodType}
                            </h3>
                            {isUrgentFreshness ? (
                              <span className="bg-amber-50 text-[#D9A441] border border-amber-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                                <ShieldAlert className="w-3 h-3 text-amber-500" />
                                {listing.freshFor}
                              </span>
                            ) : (
                              <span className="bg-[#E8F0E8] text-[#3E5F48] text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                                <Clock className="w-3 h-3" />
                                {listing.freshFor}
                              </span>
                            )}
                          </div>

                          {/* Restaurant & Location */}
                          <div className="space-y-1.5 text-xs text-[#64748B] mb-4">
                            {listing.restaurant && (
                              <p className="font-medium text-[#1F2D23] text-sm">
                                {listing.restaurant.name}
                              </p>
                            )}
                            <p className="flex items-center gap-1 text-[#64748B]">
                              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                              <span className="truncate">{listing.restaurant?.location || 'Location available'}</span>
                            </p>
                          </div>

                          {/* Quantity & Feeds estimate */}
                          <div className="bg-[#F7EDD6] rounded-xl p-3 mb-4 flex items-center justify-between text-xs border border-amber-200/60">
                            <span className="font-bold text-[#1F2D23]">
                              {listing.quantity} kg surplus
                            </span>
                            <span className="text-[#D9A441] font-semibold">
                              Feeds ~{Math.round(listing.quantity * 4)} people
                            </span>
                          </div>
                        </div>

                        {/* Claim CTA in Primary Green */}
                        <Link
                          to="/ngo/browse"
                          className="w-full bg-[#3E5F48] hover:bg-[#4F6A57] text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all duration-150 flex items-center justify-center gap-1.5 active:scale-95 no-underline"
                        >
                          <span>Claim Pickup</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column (1 Col): Notifications Preview & Recent Activity */}
            <div className="space-y-8">
              
              {/* Notifications Preview Widget */}
              <div className="bg-white border border-[#E7E5E0] rounded-[20px] p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#1F2D23]">Notifications</h3>
                    {unreadNotifications.length > 0 && (
                      <span className="bg-[#D9A441] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {unreadNotifications.length} New
                      </span>
                    )}
                  </div>
                  <Link
                    to="/ngo/notifications"
                    className="text-xs font-semibold text-[#3E5F48] hover:underline"
                  >
                    View All â†’
                  </Link>
                </div>

                {notifications.length === 0 ? (
                  <p className="text-xs text-[#64748B] py-4 text-center">No notifications yet.</p>
                ) : (
                  <div className="space-y-3">
                    {notifications.slice(0, 3).map((n) => (
                      <div
                        key={n._id}
                        className={`p-3 rounded-xl border text-xs flex items-start gap-3 transition-colors ${
                          n.read ? 'bg-white border-gray-100 text-[#64748B]' : 'bg-amber-50/50 border-amber-200 text-[#1F2D23] font-medium'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          n.read ? 'bg-gray-100 text-gray-400' : 'bg-[#D9A441] text-white'
                        }`}>
                          <Bell className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="leading-snug line-clamp-2">{n.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Activity Timeline Widget */}
              <div className="bg-white border border-[#E7E5E0] rounded-[20px] p-6 shadow-xs">
                <h3 className="text-base font-bold text-[#1F2D23] mb-4">
                  Recent Activity
                </h3>

                {pickups.length === 0 ? (
                  <p className="text-xs text-[#64748B] py-4 text-center">No recent pickup activity.</p>
                ) : (
                  <div className="relative pl-6 space-y-6">
                    {/* Vertical green timeline connector */}
                    <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-[#3E5F48]/20" />

                    {pickups.slice(0, 4).map((p) => (
                      <div key={p._id} className="relative flex items-start gap-3 text-xs">
                        <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white border-2 border-[#3E5F48] flex items-center justify-center text-[#3E5F48]">
                          <Truck className="w-2.5 h-2.5" />
                        </div>
                        <div>
                          <p className="font-bold text-[#1F2D23]">
                            {p.foodType} ({p.quantity}kg)
                          </p>
                          <p className="text-[#64748B] text-[11px] mt-0.5">
                            Status: <span className="font-semibold text-[#3E5F48]">{p.status}</span> Â· {p.restaurant?.name || 'Restaurant'}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1">{timeAgo(p.createdAt)}</p>
                        </div>
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

export default NgoDashboard;


