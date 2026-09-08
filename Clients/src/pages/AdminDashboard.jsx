import { API_BASE_URL } from '../config/api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageTransition from '../components/PageTransition';
import { IconStoreNav, IconHandshakeNav, IconPackageNav } from '../components/NavIcons';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ restaurantCount: null, ngoCount: null, activeListings: null });
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');

  useEffect(() => {
    if (!token || role !== 'admin') { navigate('/admin'); return; }
    axios.get(`${API_BASE_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => setStats(res.data)).catch(console.error);
  }, []);

  const cards = [
    {
      icon: IconStoreNav,
      value: stats.restaurantCount ?? '—',
      label: 'Total Restaurants',
      sub: 'Registered on platform',
    },
    {
      icon: IconHandshakeNav,
      value: stats.ngoCount ?? '—',
      label: 'Total NGOs',
      sub: 'Active organizations',
    },
    {
      icon: IconPackageNav,
      value: stats.activeListings ?? '—',
      label: 'Active Listings',
      sub: 'Live right now',
    },
  ];

  return (
    <PageTransition>
      <div className="font-sans min-h-screen" style={{ background: 'linear-gradient(135deg, #F2F7F2 0%, #FAF9F6 45%, #F7F2EB 100%)' }}>
        {/* Header banner (Continuous warm beige -> olive -> cream gradient) */}
        <div
          className="relative border-b border-[#E7E5E0] py-8 sm:py-12 px-4 sm:px-6 text-center overflow-hidden shadow-xs"
          style={{ background: 'linear-gradient(135deg, #E8DDD9 0%, #F4F2EB 50%, #DCD7C3 100%)' }}
        >
          <div className="absolute -top-16 -left-10 w-64 h-64 rounded-full bg-[#7E9B7A]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-10 w-64 h-64 rounded-full bg-[#D9A441]/10 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#3E5F48] text-white text-xs font-bold px-3.5 py-1 rounded-full mb-2.5 sm:mb-3 uppercase tracking-wider shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E2EDE5] animate-pulse" />
              Admin Panel
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1F2D23] mb-1 leading-snug">Admin Dashboard</h1>
            <p className="text-[#6B7280] text-xs sm:text-sm">Platform overview & management</p>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 pb-16 md:pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
            {cards.map((c) => (
              <div
                key={c.label}
                className="card-hover bg-white border border-[#E7E5E0] rounded-[20px] p-6 text-[#1F2D23] shadow-xs flex flex-col justify-between"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E8F0E8] text-[#3E5F48] flex items-center justify-center mb-4 shadow-xs">
                  <c.icon className="w-6 h-6 text-[#3E5F48]" />
                </div>
                <div>
                  <p className="text-3xl md:text-4xl font-black text-[#1F2D23] mb-1 leading-tight">{c.value}</p>
                  <p className="text-sm font-semibold text-[#6B7280]">{c.label}</p>
                  <p className="text-xs text-[#8A8F87] mt-0.5">{c.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary card */}
          <div className="bg-white border border-[#E7E5E0] shadow-xs rounded-[20px] p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#E8F0E8] text-[#3E5F48] flex items-center justify-center mx-auto mb-4 shadow-xs">
              <svg className="w-8 h-8 text-[#3E5F48]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 2l8 3.5v6c0 5-3.4 8.5-8 10.5C7.4 20 4 16.5 4 11.5v-6z"/>
                <path d="M9 12l2 2 4-4.5"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1F2D23] mb-2">Platform Health</h2>
            <p className="text-[#6B7280] text-sm max-w-md mx-auto">
              FoodBridge is running smoothly. All systems operational. Real-time notifications and listing flows are active.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="w-2 h-2 rounded-full bg-[#3E5F48] animate-pulse" />
              <span className="text-[#3E5F48] text-sm font-semibold">All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default AdminDashboard;


