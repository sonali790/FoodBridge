import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NgoLayout from '../components/NgoLayout';
import PageTransition from '../components/PageTransition';
import {
  Bell,
  CheckCheck,
  Sparkles,
  Truck,
  Info,
  Clock,
  RefreshCw,
  AlertCircle
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

function NgoNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'pickups' | 'system'
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');

  useEffect(() => {
    if (!token || role !== 'ngo') { navigate('/start/login'); return; }
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/notifications/mine', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async (n) => {
    if (n.read) return;
    try {
      await axios.patch(`/api/notifications/${n._id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications((prev) => prev.map((item) => item._id === n._id ? { ...item, read: true } : item));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    try {
      await Promise.all(unread.map(n =>
        axios.patch(`/api/notifications/${n._id}/read`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ));
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'pickups') return n.message?.toLowerCase().includes('claim') || n.message?.toLowerCase().includes('pickup');
    if (filter === 'system') return !n.message?.toLowerCase().includes('claim') && !n.message?.toLowerCase().includes('pickup');
    return true;
  });

  return (
    <NgoLayout>
      <PageTransition>
        <div className="space-y-8 font-sans bg-[#F8F6F3] text-[#1F2D23]">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#D9A441] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-100" />
                <span>INBOX & ALERTS</span>
              </div>
              <h1 className="text-[34px] font-extrabold text-[#1F2D23] tracking-tight leading-tight">
                Notifications Center
              </h1>
              <p className="text-[#64748B] text-base mt-1">
                Real-time updates on nearby food listings, claim status, and administrative alerts.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="bg-white border border-[#E7E5E0] text-[#3E5F48] hover:bg-[#E8F0E8] font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 self-start sm:self-center"
              >
                <CheckCheck className="w-4 h-4 text-[#3E5F48]" />
                <span>Mark All as Read</span>
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1.5 bg-white border border-[#E7E5E0] p-1.5 rounded-[20px] shadow-xs w-fit overflow-x-auto">
            {[
              ['all', `All (${notifications.length})`],
              ['unread', `Unread (${unreadCount})`],
              ['pickups', 'Pickups'],
              ['system', 'System']
            ].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 flex-shrink-0 ${
                  filter === val
                    ? 'bg-[#3E5F48] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#1F2D23] hover:bg-gray-100/60'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Notifications List / Empty State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <RefreshCw className="w-8 h-8 text-[#3E5F48] animate-spin" />
              <p className="text-sm font-medium text-[#64748B]">Loading notifications…</p>
            </div>
          ) : filtered.length === 0 ? (
            /* Empty State */
            <div className="bg-white border border-[#E7E5E0] rounded-[20px] p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-lg">
              <div className="w-16 h-16 rounded-2xl bg-[#E8F0E8] text-[#3E5F48] flex items-center justify-center mb-4">
                <Bell className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2D23] mb-2">
                {filter === 'unread' ? 'All caught up!' : 'No notifications found'}
              </h3>
              <p className="text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
                {filter === 'unread'
                  ? 'You have read all your notifications.'
                  : 'New alerts about food donations and pickup status will appear here.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-w-3xl">
              {filtered.map((n) => {
                const isPickupAlert = n.message?.toLowerCase().includes('claim') || n.message?.toLowerCase().includes('pickup');
                return (
                  <div
                    key={n._id}
                    onClick={() => handleClick(n)}
                    className={`bg-white border border-[#E7E5E0] rounded-[20px] p-4 shadow-xs hover:bg-[#F8F6F3] transition-all duration-150 cursor-pointer flex items-start gap-4 ${
                      !n.read ? 'border-l-4 border-l-[#3E5F48]' : ''
                    }`}
                  >
                    {/* Icon container */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      !n.read ? 'bg-[#E8F0E8] text-[#3E5F48]' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isPickupAlert ? <Truck className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                    </div>

                    {/* Message content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm leading-snug ${!n.read ? 'font-bold text-[#1F2D23]' : 'text-[#64748B]'}`}>
                          {n.message}
                        </p>
                        {!n.read && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#3E5F48] flex-shrink-0" title="Unread" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span>{timeAgo(n.createdAt)}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </PageTransition>
    </NgoLayout>
  );
}

export default NgoNotifications;
