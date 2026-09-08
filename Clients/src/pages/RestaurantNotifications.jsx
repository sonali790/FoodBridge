import { API_BASE_URL } from '../config/api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RestaurantLayout from '../components/RestaurantLayout';
import PageTransition from '../components/PageTransition';
import { IconBellNav } from '../components/NavIcons';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function RestaurantNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'read'
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');

  useEffect(() => {
    if (!token || role !== 'restaurant') { navigate('/start/login'); return; }
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/notifications/mine`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setNotifications(res.data);
  };

  const handleClick = async (n) => {
    if (n.read) return;
    await axios.patch(`http://localhost:5000/api/notifications/${n._id}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setNotifications((prev) => prev.map((item) => item._id === n._id ? { ...item, read: true } : item));
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    await Promise.all(unread.map(n =>
      axios.patch(`http://localhost:5000/api/notifications/${n._id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ));
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filtered = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : filter === 'read'
    ? notifications.filter(n => n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <RestaurantLayout>
      <PageTransition>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-ink mb-1">Notifications</h1>
            <p className="text-ink-soft text-sm">
              Updates on your food listings
              {unreadCount > 0 && (
                <span className="ml-2 bg-[#D9A441] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">{unreadCount} unread</span>
              )}
            </p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-primary hover:underline font-semibold">
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-6 bg-white border border-[#E7E5E0] p-1.5 rounded-[20px] shadow-xs w-fit">
          {[['all', 'All'], ['unread', 'Unread'], ['read', 'Read']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                filter === val
                  ? 'bg-[#3E5F48] text-white shadow-xs font-semibold'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              {label}
              {val === 'unread' && unreadCount > 0 && (
                <span className="ml-1.5 bg-[#D9A441] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications list */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 shadow-fb-card rounded-2xl p-12 text-center max-w-lg">
            <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-4">
              <IconBellNav className="w-7 h-7 text-primary-dark" />
            </div>
            <h3 className="font-bold text-ink mb-2">
              {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
            </h3>
            <p className="text-ink-soft text-sm">
              {filter === 'unread'
                ? 'You have no unread notifications.'
                : 'Notifications about your listings will appear here.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-w-xl">
            {filtered.map((n) => (
              <button
                key={n._id}
                onClick={() => handleClick(n)}
                className={`text-left rounded-2xl p-4 border flex items-start gap-3.5 transition-all duration-200 group ${
                  n.read
                    ? 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                    : 'bg-primary-light/30 border-primary/30 hover:bg-primary-light/50 shadow-sm'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-105 ${
                  n.read ? 'bg-gray-100 text-gray-400' : 'bg-primary text-white'
                }`}>
                  <IconBellNav className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-snug ${n.read ? 'text-ink-soft' : 'text-ink font-medium'}`}>{n.message}</p>
                  <p className="text-xs mt-1.5 text-ink-soft/60">{timeAgo(n.createdAt)}</p>
                </div>
                {!n.read && (
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" aria-label="Unread" />
                )}
              </button>
            ))}
          </div>
        )}
      </PageTransition>
    </RestaurantLayout>
  );
}

export default RestaurantNotifications;


