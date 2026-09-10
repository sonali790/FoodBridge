import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from './ToastContext';

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
  'Critical': 'bg-red-50 text-red-700 border border-red-200 font-bold animate-pulse'
};

export default function ComplaintsList({ refreshTrigger }) {
  const { showToast } = useToast();
  const [complaints, setComplaints] = useState({ filedByMe: [], filedAgainstMe: [] });
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab] = useState('filedByMe'); // 'filedByMe' | 'filedAgainstMe'
  const token = localStorage.getItem('token');

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/complaints/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(res.data);
    } catch (err) {
      console.error('Failed to load complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchComplaints();
  }, [refreshTrigger]);

  const activeList = subTab === 'filedByMe' ? complaints.filedByMe : complaints.filedAgainstMe;

  return (
    <div className="space-y-5">
      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setSubTab('filedByMe')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'filedByMe'
              ? 'bg-[#3E5F48] text-white shadow-xs'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Filed by Me ({complaints.filedByMe.length})
        </button>
        <button
          onClick={() => setSubTab('filedAgainstMe')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'filedAgainstMe'
              ? 'bg-[#3E5F48] text-white shadow-xs'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Involving Me ({complaints.filedAgainstMe.length})
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-gray-500">Loading complaints & dispute records…</div>
      ) : activeList.length === 0 ? (
        <div className="bg-white border border-[#E7E5E0] rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3 className="font-bold text-ink text-sm mb-1">No complaints recorded</h3>
          <p className="text-xs text-ink-soft">
            {subTab === 'filedByMe'
              ? 'You have not reported any issues or disputes.'
              : 'No issues have been reported involving your account.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {activeList.map((c) => (
            <div
              key={c._id}
              className="bg-white border border-[#E7E5E0] rounded-2xl p-5 shadow-xs hover:border-gray-300 transition-all space-y-3.5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold text-ink">{c.category}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${STATUS_BADGES[c.status] || 'bg-gray-100 text-gray-700'}`}>
                      {c.status}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${URGENCY_BADGES[c.urgency] || 'bg-gray-100 text-gray-600'}`}>
                      {c.urgency} Urgency
                    </span>
                  </div>
                  <h4 className="font-bold text-ink text-base">{c.subject}</h4>
                  <p className="text-xs text-ink-soft">
                    Target: <strong className="text-ink">{c.againstUser?.name || 'Partner'}</strong> ({c.againstModel}) · Listing: {c.listing?.foodType} ({c.listing?.quantity}kg)
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Description */}
              <div className="bg-[#FAF9F6] border border-[#E7E5E0] rounded-xl p-3 text-xs text-ink leading-relaxed">
                <p className="font-semibold text-gray-500 mb-1">Issue Details:</p>
                {c.description}
              </div>

              {/* Admin Resolution Box */}
              {c.adminResolution && (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <span>Admin Resolution Note</span>
                    {c.resolvedAt && (
                      <span className="text-[10px] text-emerald-700 font-normal">
                        ({new Date(c.resolvedAt).toLocaleDateString()})
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed">{c.adminResolution}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
