import { API_BASE_URL } from '../config/api';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import RestaurantLayout from '../components/RestaurantLayout';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';
import { IconPackageNav, IconBellNav } from '../components/NavIcons';

function StatCard({ icon: Icon, value, label, sublabel }) {
  return (
    <div className="card-hover bg-white border border-[#E7E5E0] shadow-fb-card rounded-[20px] p-6 flex flex-col justify-between">
      <div className="w-12 h-12 rounded-xl bg-[#E8F0E8] text-[#3E5F48] flex items-center justify-center mb-4 shadow-xs">
        <Icon className="w-6 h-6 text-[#3E5F48]" />
      </div>
      <div>
        <p className="text-3xl font-black text-[#1F2D23] leading-tight">{value}</p>
        <p className="text-sm font-semibold text-[#6B7280] mt-1">{label}</p>
        {sublabel && <p className="text-xs text-[#8A8F87] mt-1 font-medium">{sublabel}</p>}
      </div>
    </div>
  );
}

function RestaurantDashboard() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');
  const name  = localStorage.getItem('name') || 'there';

  useEffect(() => {
    if (!token || role !== 'restaurant') { navigate('/start/login'); return; }
    axios.get(`${API_BASE_URL}/api/listings/mine`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => setListings(res.data)).catch(console.error);
  }, []);

  const activeCount    = listings.filter((l) => l.status === 'Notified').length;
  const claimedCount   = listings.filter((l) => l.status === 'Claimed').length;
  const completedCount = listings.filter((l) => l.status === 'Picked Up').length;

  const recentListings = [...listings].slice(0, 5);

  const STATUS_COLORS = {
    Notified:   'bg-primary-light text-primary-dark',
    Claimed:    'bg-secondary-light text-secondary-dark',
    'Picked Up':'bg-[#E8F0E8] text-[#3E5F48]',
    Expired:    'bg-gray-100 text-gray-500',
  };

  return (
    <RestaurantLayout>
      <PageTransition>
        {/* Welcome banner (Light green + white continuous gradient) */}
        <div
          className="relative rounded-[20px] border border-[#E7E5E0] px-6 md:px-8 py-7 mb-8 overflow-hidden shadow-xs"
          style={{ background: 'linear-gradient(135deg, #F8FFFA 0%, #EDF7F0 50%, #DCEFE2 100%)' }}
        >
          <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-[#3E5F48]/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 right-24 w-36 h-36 rounded-full bg-[#7E9B7A]/15 blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-[#3E5F48]/10 text-[#3E5F48] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-[#3E5F48]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3E5F48] animate-pulse" />
              Restaurant Dashboard
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1F2D23] mb-1 leading-snug">Hello, {name} ðŸ‘‹</h1>
            <p className="text-[#6B7280] text-sm font-normal">Here's what's happening with your listings today.</p>
          </div>
        </div>

        {/* Stat cards (Identical styling for all 4 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
          <StatCard
            icon={IconPackageNav}
            value={listings.length}
            label="Total Listings"
            sublabel="All posted items"
          />
          <StatCard
            icon={IconBellNav}
            value={activeCount}
            label="Active Listings"
            sublabel="Awaiting claim"
          />
          <StatCard
            icon={IconBellNav}
            value={claimedCount}
            label="Claimed Pickups"
            sublabel="Being picked up"
          />
          <StatCard
            icon={IconPackageNav}
            value={completedCount}
            label="Completed Donations"
            sublabel="Meals delivered"
          />
        </div>

        {/* Quick Actions (Unified button styling) */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-6 sm:mb-8">
          <Link
            to="/restaurant/post"
            className="w-full sm:w-auto justify-center no-underline bg-gradient-to-r from-[#4A7C59] to-[#3E5F48] text-white hover:opacity-95 font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-full shadow-xs transition-all active:scale-95 flex items-center gap-2"
          >
            <span>+ Post Surplus Food</span>
          </Link>
          <Link
            to="/restaurant/notifications"
            className="w-full sm:w-auto justify-center no-underline bg-white border border-[#3E5F48] text-[#3E5F48] hover:bg-[#3E5F48] hover:text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-full shadow-xs transition-all active:scale-95 flex items-center gap-2"
          >
            <span>View Notifications</span>
          </Link>
          <Link
            to="/restaurant/ratings"
            className="w-full sm:w-auto justify-center no-underline bg-white border border-[#3E5F48] text-[#3E5F48] hover:bg-[#3E5F48] hover:text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-full shadow-xs transition-all active:scale-95 flex items-center gap-2"
          >
            <span>Ratings & Reviews</span>
          </Link>
        </div>

        {/* Recent Listings table */}
        {recentListings.length > 0 && (
          <div className="bg-white border border-[#E7E5E0] shadow-xs rounded-[20px] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E7E5E0] flex items-center justify-between">
              <h2 className="font-bold text-ink">Recent Listings</h2>
              <Link to="/restaurant/post" className="text-xs text-primary font-semibold hover:underline no-underline">View all â†’</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F8F6F3] border-b border-[#E7E5E0]">
                  <tr>
                    {['Food Type', 'Quantity', 'Fresh For', 'Status', 'Posted'].map(h => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-ink-soft uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E5E0]">
                  {recentListings.map((l) => (
                    <tr key={l._id} className="hover:bg-[#F4EDE3]/30 transition-colors duration-100">
                      <td className="px-6 py-3.5 font-medium text-ink">{l.foodType}</td>
                      <td className="px-6 py-3.5 text-ink-soft">{l.quantity}kg</td>
                      <td className="px-6 py-3.5 text-ink-soft">{l.freshFor}</td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[l.status] || 'bg-gray-100 text-gray-600'}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                          {l.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-ink-soft">{new Date(l.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {listings.length === 0 && (
          <div className="bg-white border border-[#E7E5E0] shadow-xs rounded-[20px] p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-4">
              <IconPackageNav className="w-8 h-8 text-primary-dark" />
            </div>
            <h3 className="font-bold text-ink mb-2">No listings yet</h3>
            <p className="text-ink-soft text-sm mb-5">Start by posting your first surplus food listing.</p>
            <Link to="/restaurant/post" className="no-underline">
              <Button variant="primary">Post Your First Listing</Button>
            </Link>
          </div>
        )}
      </PageTransition>
    </RestaurantLayout>
  );
}

export default RestaurantDashboard;


