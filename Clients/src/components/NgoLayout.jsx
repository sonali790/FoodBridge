import { API_BASE_URL } from '../config/api';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard,
  Search,
  Bell,
  Truck,
  Star,
  User,
  LogOut,
  Menu,
  X,
  HeartHandshake
} from 'lucide-react';

function NgoLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingRatings, setPendingRatings] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name') || 'NGO Partner';

  const fetchBadges = () => {
    if (!token) return;
    axios.get(`${API_BASE_URL}/api/notifications/mine`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      setUnreadCount(res.data.filter((n) => !n.read).length);
    }).catch(() => {});

    axios.get(`${API_BASE_URL}/api/ratings/badge-count`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      setPendingRatings(res.data.total);
    }).catch(() => {});
  };

  useEffect(() => {
    fetchBadges();
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const interval = setInterval(fetchBadges, 4000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'Dashboard',         path: '/ngo/dashboard',     icon: LayoutDashboard },
    { label: 'Browse Listings',   path: '/ngo/browse',        icon: Search },
    { label: 'Notifications',     path: '/ngo/notifications', icon: Bell,  badge: unreadCount },
    { label: 'My Pickups',        path: '/ngo/pickups',       icon: Truck },
    { label: 'Tracker',           active: false,              icon: LayoutDashboard },
    { label: 'Ratings & Reviews', path: '/ngo/ratings',       icon: Star,  badge: pendingRatings },
    { label: 'Profile',           path: '/ngo/profile',       icon: User },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full text-white" style={{ background: 'linear-gradient(180deg, #3E5F48 0%, #4F6A57 50%, #6A7F63 100%)' }}>
      {/* Brand header */}
      <div className="px-6 py-6 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm flex-shrink-0" style={{ background: '#D9A441' }}>
          <HeartHandshake className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-white font-bold text-base leading-tight truncate">{name}</h2>
          <p className="text-xs font-semibold uppercase tracking-wider mt-0.5" style={{ color: '#D9A441' }}>NGO Community</p>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1" aria-label="NGO sidebar navigation">
        <p className="text-xs font-semibold uppercase tracking-wider px-3 mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>Main Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return item.path ? (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`group flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'text-white font-semibold shadow-sm'
                  : 'hover:text-white'
              }`}
              style={isActive
                ? { background: 'rgba(74,124,89,0.9)' }
                : { color: 'rgba(255,255,255,0.8)', ':hover': { background: 'rgba(255,255,255,0.1)' } }
              }
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-150 group-hover:scale-105 ${isActive ? 'text-white' : ''}`} style={isActive ? {} : { color: 'rgba(255,255,255,0.65)' }} />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge > 0 && (
                <span className="text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center" style={{ background: '#D9A441' }}>
                  {item.badge}
                </span>
              )}
            </Link>
          ) : (
            <div
              key={item.label}
              className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium cursor-not-allowed opacity-50"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              <Icon className="w-5 h-5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }} />
              <span className="flex-1 truncate">{item.label}</span>
              <span className="text-xs border rounded-full px-2 py-0.5 font-normal" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.4)' }}>
                Soon
              </span>
            </div>
          );
        })}
      </nav>

      {/* Small Org Profile Card & Logout */}
      <div className="p-4 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
        <Link
          to="/ngo/profile"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 p-2.5 rounded-xl transition-colors text-xs"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.9)' }}
        >
          <div className="w-7 h-7 rounded-lg text-white flex items-center justify-center font-bold text-xs" style={{ background: '#D9A441' }}>
            {name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white truncate">{name}</p>
            <p className="text-xs truncate" style={{ color: '#D9A441' }}>Verified Partner</p>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group"
          style={{ color: 'rgba(255,255,255,0.65)' }}
        >
          <LogOut className="w-5 h-5 flex-shrink-0 transition-transform group-hover:-translate-x-0.5" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)] font-sans relative" style={{ background: 'linear-gradient(135deg, #E8F0E8 0%, #F6F8F3 45%, #F4EDE3 100%)' }}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 backdrop-blur-sm z-40 transition-opacity"
          style={{ background: 'rgba(31,45,35,0.35)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          flex-shrink-0 w-64 flex flex-col
          fixed md:static inset-y-0 left-0 z-50 h-full md:h-auto
          transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        aria-label="NGO Sidebar Navigation"
      >
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0" style={{ background: 'transparent' }}>
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3.5 bg-white border-b shadow-xs sticky top-16 z-20" style={{ borderColor: '#E7E5E0' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: '#3E5F48' }}>
              FB
            </div>
            <span className="text-sm font-bold" style={{ color: '#1F2D23' }}>NGO Portal</span>
          </div>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-2 rounded-xl transition-colors bg-gray-100"
            style={{ color: '#6B7280' }}
            aria-label="Toggle Navigation Menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Inner Content Container */}
        <div className="p-4 sm:p-6 md:p-8 pb-16 md:pb-20 max-w-7xl mx-auto space-y-6 md:space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default NgoLayout;


