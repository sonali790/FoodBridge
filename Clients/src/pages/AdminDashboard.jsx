import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageTransition from '../components/PageTransition';
import { IconStoreNav, IconHandshakeNav, IconPackageNav } from '../components/NavIcons';
import { useToast } from '../components/ToastContext';

const STATUS_BADGES = {
  'Pending': 'bg-amber-100 text-amber-800 border-amber-200',
  'Under Investigation': 'bg-blue-100 text-blue-800 border-blue-200',
  'Resolved': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Dismissed': 'bg-gray-100 text-gray-700 border-gray-200'
};

const URGENCY_BADGES = {
  'Low': 'bg-gray-100 text-gray-600',
  'Medium': 'bg-amber-50 text-amber-700 border border-amber-200',
  'High': 'bg-orange-50 text-orange-700 border border-orange-200 font-bold',
  'Critical': 'bg-red-50 text-red-700 border border-red-200 font-bold'
};

function AdminDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [stats, setStats] = useState({ restaurantCount: null, ngoCount: null, activeListings: null });
  const [complaintData, setComplaintData] = useState({ complaints: [], counts: { total: 0, pending: 0, investigating: 0, resolved: 0 } });
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [resolutionStatus, setResolutionStatus] = useState('Resolved');
  const [resolutionNote, setResolutionNote] = useState('');
  const [submittingResolution, setSubmittingResolution] = useState(false);
  const [loadingComplaints, setLoadingComplaints] = useState(true);

  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');

  useEffect(() => {
    if (!token || role !== 'admin') { navigate('/admin'); return; }
    fetchStats();
    fetchComplaints();
  }, [statusFilter]);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const fetchComplaints = async () => {
    setLoadingComplaints(true);
    try {
      const res = await axios.get(`/api/complaints/admin?status=${statusFilter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaintData(res.data);
    } catch (err) {
      console.error('Failed to load complaints:', err);
    } finally {
      setLoadingComplaints(false);
    }
  };

  const handleOpenResolution = (complaint) => {
    setActiveComplaint(complaint);
    setResolutionStatus(complaint.status === 'Pending' ? 'Resolved' : complaint.status);
    setResolutionNote(complaint.adminResolution || '');
  };

  const handleSaveResolution = async (e) => {
    e.preventDefault();
    if (!activeComplaint) return;
    setSubmittingResolution(true);
    try {
      await axios.patch(`/api/complaints/${activeComplaint._id}/status`, {
        status: resolutionStatus,
        adminResolution: resolutionNote.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Complaint resolution updated and complainant notified! 🎉', 'success');
      setActiveComplaint(null);
      fetchComplaints();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update resolution', 'error');
    } finally {
      setSubmittingResolution(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

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
    {
      icon: null,
      customIcon: (
        <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
      value: complaintData.counts?.pending ?? '0',
      label: 'Pending Disputes',
      sub: `${complaintData.counts?.total ?? 0} total registered`,
      alert: (complaintData.counts?.pending ?? 0) > 0
    }
  ];

  return (
    <PageTransition>
      <div className="font-sans min-h-screen" style={{ background: 'linear-gradient(135deg, #F2F7F2 0%, #FAF9F6 45%, #F7F2EB 100%)' }}>
        {/* Header banner */}
        <div
          className="relative border-b border-[#E7E5E0] py-8 sm:py-10 px-4 sm:px-6 overflow-hidden shadow-xs"
          style={{ background: 'linear-gradient(135deg, #E8DDD9 0%, #F4F2EB 50%, #DCD7C3 100%)' }}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between relative z-10">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 bg-[#3E5F48] text-white text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wider shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E2EDE5] animate-pulse" />
                Admin Panel
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2D23] leading-snug">Admin Dashboard</h1>
              <p className="text-[#6B7280] text-xs sm:text-sm">Platform management & dispute resolution</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white text-red-600 font-bold text-xs border border-red-200 transition-all shadow-xs"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-20 space-y-8">
          
          {/* Stats 4-Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((c) => (
              <div
                key={c.label}
                className={`card-hover bg-white border rounded-[20px] p-5 shadow-xs flex flex-col justify-between ${
                  c.alert ? 'border-red-300 ring-2 ring-red-500/20' : 'border-[#E7E5E0]'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 shadow-xs ${
                  c.alert ? 'bg-red-50' : 'bg-[#E8F0E8]'
                }`}>
                  {c.customIcon ? c.customIcon : <c.icon className="w-5 h-5 text-[#3E5F48]" />}
                </div>
                <div>
                  <p className="text-3xl font-black text-[#1F2D23] mb-0.5 leading-tight">{c.value}</p>
                  <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">{c.label}</p>
                  <p className="text-xs text-[#8A8F87] mt-0.5">{c.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Grievance & Complaints Desk Section */}
          <div className="bg-white border border-[#E7E5E0] rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <h2 className="text-xl font-black text-ink">Grievance & Complaint Desk</h2>
                  <span className="text-xs font-bold bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full">
                    {complaintData.counts?.total ?? 0} Total
                  </span>
                </div>
                <p className="text-xs text-ink-soft">Review reported disputes between restaurants and NGOs and issue official resolutions.</p>
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'Pending', label: `Pending (${complaintData.counts?.pending ?? 0})` },
                  { key: 'Under Investigation', label: `Investigating (${complaintData.counts?.investigating ?? 0})` },
                  { key: 'Resolved', label: `Resolved (${complaintData.counts?.resolved ?? 0})` },
                  { key: 'Dismissed', label: 'Dismissed' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setStatusFilter(tab.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      statusFilter === tab.key
                        ? 'bg-[#3E5F48] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Complaints List */}
            {loadingComplaints ? (
              <div className="p-8 text-center text-sm text-gray-500">Loading dispute cases…</div>
            ) : complaintData.complaints.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className="font-bold text-ink text-base">No complaints in this queue</h3>
                <p className="text-xs text-ink-soft mt-1">There are no reported issues matching this filter criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {complaintData.complaints.map((c) => (
                  <div
                    key={c._id}
                    className="border border-[#E7E5E0] rounded-2xl p-5 hover:border-gray-300 transition-all bg-[#FAF9F6]/50 space-y-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-extrabold text-ink">{c.category}</span>
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${STATUS_BADGES[c.status] || 'bg-gray-100 text-gray-700'}`}>
                            {c.status}
                          </span>
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full ${URGENCY_BADGES[c.urgency] || 'bg-gray-100 text-gray-600'}`}>
                            {c.urgency} Urgency
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-ink">{c.subject}</h3>
                      </div>
                      <span className="text-xs text-gray-400">
                        Filed: {new Date(c.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {/* Parties Involved */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-gray-100 text-xs">
                      <div>
                        <p className="font-semibold text-gray-400 uppercase text-[10px]">Complainant ({c.filedByModel})</p>
                        <p className="font-bold text-ink text-sm">{c.filedBy?.name || 'Unknown'}</p>
                        <p className="text-ink-soft">{c.filedBy?.email} · {c.filedBy?.location || 'Location N/A'}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-400 uppercase text-[10px]">Against Party ({c.againstModel})</p>
                        <p className="font-bold text-ink text-sm">{c.againstUser?.name || 'Unknown'}</p>
                        <p className="text-ink-soft">{c.againstUser?.email} · {c.againstUser?.location || 'Location N/A'}</p>
                      </div>
                    </div>

                    {/* Food Listing Info */}
                    <div className="text-xs text-ink-soft">
                      Listing: <strong className="text-ink">{c.listing?.foodType}</strong> ({c.listing?.quantity}kg) · Exchange Status: <span className="font-semibold text-ink">{c.listing?.status}</span>
                    </div>

                    {/* Dispute Details */}
                    <div className="bg-white border border-[#E7E5E0] rounded-xl p-3.5 text-xs text-ink">
                      <p className="font-bold text-gray-500 mb-1 text-[11px] uppercase tracking-wide">Reported Issue Details:</p>
                      <p className="leading-relaxed whitespace-pre-wrap">{c.description}</p>
                    </div>

                    {/* Admin Resolution Display */}
                    {c.adminResolution && (
                      <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950">
                        <span className="font-bold block text-emerald-900 mb-0.5">Admin Resolution:</span>
                        <p className="leading-relaxed">{c.adminResolution}</p>
                      </div>
                    )}

                    {/* Action button */}
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleOpenResolution(c)}
                        className="px-4 py-2 rounded-xl bg-[#3E5F48] hover:bg-[#4F6A57] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                        </svg>
                        <span>{c.status === 'Pending' ? 'Investigate & Resolve' : 'Update Resolution'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Platform Health card */}
          <div className="bg-white border border-[#E7E5E0] shadow-xs rounded-3xl p-7 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#E8F0E8] text-[#3E5F48] flex items-center justify-center mx-auto mb-3 shadow-xs">
              <svg className="w-7 h-7 text-[#3E5F48]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2l8 3.5v6c0 5-3.4 8.5-8 10.5C7.4 20 4 16.5 4 11.5v-6z"/>
                <path d="M9 12l2 2 4-4.5"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[#1F2D23] mb-1">System Health & Stability</h2>
            <p className="text-[#6B7280] text-xs max-w-md mx-auto">
              FoodBridge cloud cluster connected. Notifications, auth guard, and dispute mechanisms are fully operational.
            </p>
          </div>
        </div>

        {/* Resolution Modal */}
        {activeComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E7E5E0] space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-ink">Resolve Dispute #{activeComplaint._id.slice(-6)}</h3>
                <button
                  onClick={() => setActiveComplaint(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs bg-gray-50 p-3 rounded-xl space-y-1">
                <p><strong>Category:</strong> {activeComplaint.category}</p>
                <p><strong>Subject:</strong> {activeComplaint.subject}</p>
                <p><strong>Complainant:</strong> {activeComplaint.filedBy?.name} ({activeComplaint.filedByModel})</p>
                <p><strong>Against:</strong> {activeComplaint.againstUser?.name} ({activeComplaint.againstModel})</p>
              </div>

              <form onSubmit={handleSaveResolution} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wide">
                    Resolution Status
                  </label>
                  <select
                    value={resolutionStatus}
                    onChange={(e) => setResolutionStatus(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white font-semibold text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Under Investigation">Under Investigation</option>
                    <option value="Resolved">Resolved (Accept Complaint & Resolve)</option>
                    <option value="Dismissed">Dismissed (Inconclusive / Invalid)</option>
                    <option value="Pending">Pending (Re-open)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wide">
                    Official Admin Resolution Note <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    placeholder="Enter findings, guidance provided, or corrective action taken. This will be sent as a notification to the complainant."
                    className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none text-ink placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveComplaint(null)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingResolution}
                    className="px-5 py-2 rounded-xl bg-[#3E5F48] hover:bg-[#4F6A57] text-white font-bold text-xs shadow-xs disabled:opacity-60"
                  >
                    {submittingResolution ? 'Saving…' : 'Publish Resolution'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

export default AdminDashboard;
