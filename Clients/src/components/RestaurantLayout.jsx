import { API_BASE_URL } from '../config/api';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  IconGrid, IconPlusCircle, IconBellNav, IconStarNav, IconUserNav, IconLogout
} from './NavIcons';

function MenuToggle({ open, onClick }) {
  return (
    <button
      onClick={onClick}
      className="md:hidden p-2 rounded-xl text-forest-muted hover:bg-forest-light hover:text-white transition-colors"
      aria-label={open ? 'Close sidebar' : 'Open sidebar'}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {open ? (
          <><line x1="15" y1="5" x2="5" y2="15"/><line x1="5" y1="5" x2="15" y2="15"/></>
        ) : (
          <><line x1="2" y1="5" x2="18" y2="5"/><line x1="2" y1="10" x2="18" y2="10"/><line x1="2" y1="15" x2="18" y2="15"/></>
        )}
      </svg>
    </button>
  );
}

function RestaurantLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingRatings, setPendingRatings] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name') || 'Chef';

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
    { label: 'Dashboard',       path: '/restaurant/dashboard',     icon: IconGrid },
    { label: 'Post Food',       path: '/restaurant/post',          icon: IconPlusCircle },
    { label: 'Notifications',   path: '/restaurant/notifications', icon: IconBellNav,  badge: unreadCount },
    { label: 'My Listings',     active: false,                     icon: IconGrid },
    { label: 'Tracker',         active: false,                     icon: IconGrid },
    { label: 'Ratings',         path: '/restaurant/ratings',       icon: IconStarNav,  badge: pendingRatings },
    { label: 'Profile',         active: false,                     icon: IconUserNav },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const SidebarContent = () => (
    <>
      {/* Brand header */}
      <div className="px-5 py-5 border-b border-forest-light/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-xs">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l1.5-5h15L21 9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/>
              <path d="M5 9v10h14V9"/><path d="M10 19v-5h4v5"/>
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-bold leading-tight truncate">{name}</p>
            <p className="text-primary text-[10px] font-semibold uppercase tracking-widest mt-0.5">Restaurant</p>
          </div>
        </div>
        {/* Mobile close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
          aria-label="Close sidebar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Restaurant navigation">
        <p className="text-[10px] text-forest-muted font-semibold uppercase tracking-widest mb-3 px-3">Menu</p>
        <div className="flex flex-col gap-1">
          {navItems.map((item) =>
            item.path ? (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm no-underline transition-all duration-150 ${
                  location.pathname === item.path
                    ? 'bg-primary text-white font-semibold shadow-sm'
                    : 'text-forest-muted hover:bg-forest-light/80 hover:text-white'
                }`}
              >
                <item.icon className={`w-[17px] h-[17px] flex-shrink-0 transition-transform group-hover:scale-110 ${
                  location.pathname === item.path ? 'text-white' : ''
                }`} />
                <span className="flex-1 leading-none truncate">{item.label}</span>
                {item.badge > 0 && (
                  <span className="pulse-badge bg-secondary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                    {item.badge}
                  </span>
                )}
              </Link>
            ) : (
              <span
                key={item.label}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-forest-muted/40 cursor-not-allowed"
              >
                <item.icon className="w-[17px] h-[17px] flex-shrink-0" />
                <span className="flex-1 leading-none truncate">{item.label}</span>
                <span className="text-[9px] bg-forest-light px-1.5 py-0.5 rounded-full text-forest-muted/60 font-medium">Soon</span>
              </span>
            )
          )}
        </div>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-forest-light/60">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-150 group"
        >
          <IconLogout className="w-[17px] h-[17px] flex-shrink-0 transition-transform group-hover:-translate-x-0.5" />
          <span>Log out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)] font-sans relative">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar â€” desktop always visible, mobile slide-in */}
      <aside
        className={`
          flex-shrink-0 w-64 md:w-60 flex flex-col
          fixed md:static inset-y-0 left-0 z-50 h-full md:h-auto
          transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ background: 'linear-gradient(180deg, #3E5F48 0%, #4F6A57 50%, #6A7F63 100%)' }}
        aria-label="Restaurant sidebar"
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0" style={{ background: 'linear-gradient(135deg, #F2F7F2 0%, #FAF9F6 45%, #F7F2EB 100%)' }}>
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3.5 bg-white border-b border-[#E7E5E0] shadow-xs sticky top-16 z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-sm font-bold text-ink truncate">Restaurant Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="p-2 rounded-xl bg-gray-100 text-ink hover:bg-gray-200 transition-colors"
            aria-label="Open sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="2" y1="5" x2="18" y2="5"/><line x1="2" y1="10" x2="18" y2="10"/><line x1="2" y1="15" x2="18" y2="15"/>
            </svg>
          </button>
        </div>
        <div className="p-4 sm:p-6 md:p-8 pb-16 md:pb-20 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

export default RestaurantLayout;


