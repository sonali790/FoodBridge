import { API_BASE_URL } from '../config/api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NgoLayout from '../components/NgoLayout';
import PageTransition from '../components/PageTransition';
import { useToast } from '../components/ToastContext';
import {
  Search,
  MapPin,
  Clock,
  Utensils,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
  ShieldAlert,
  Sparkles,
  Package
} from 'lucide-react';

const CATEGORIES = ['All', 'Rice', 'Curry', 'Roti', 'Snacks', 'Sweets', 'Other'];

function NgoBrowseListings() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [locationFilter, setLocationFilter] = useState('');

  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');

  useEffect(() => {
    if (!token || role !== 'ngo') { navigate('/start/login'); return; }
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/listings/available`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setListings(res.data || []);
    } catch (err) {
      console.error('Error fetching available listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (id, foodType) => {
    setClaimingId(id);
    try {
      await axios.post(`http://localhost:5000/api/listings/${id}/claim`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast(`Successfully claimed ${foodType}! ðŸŽ‰`, 'success');
      fetchListings();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to claim listing', 'error');
      fetchListings();
    } finally {
      setClaimingId(null);
    }
  };

  // Filter & Sort Logic
  let filtered = listings.filter((l) => {
    const matchesSearch =
      !search ||
      l.foodType.toLowerCase().includes(search.toLowerCase()) ||
      l.restaurant?.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.restaurant?.location?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      l.foodType.toLowerCase() === selectedCategory.toLowerCase();

    const matchesLocation =
      !locationFilter ||
      l.restaurant?.location?.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesCategory && matchesLocation;
  });

  if (sortBy === 'quantity') {
    filtered.sort((a, b) => Number(b.quantity || 0) - Number(a.quantity || 0));
  } else if (sortBy === 'freshness') {
    filtered.sort((a, b) => (a.freshFor || '').localeCompare(b.freshFor || ''));
  }

  return (
    <NgoLayout>
      <PageTransition>
        <div className="space-y-8 font-sans bg-[#F8F6F3] text-[#1F2D23]">
          
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#D9A441] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-100" />
              <span>SURPLUS MARKETPLACE</span>
            </div>
            <h1 className="text-[34px] font-extrabold text-[#1F2D23] tracking-tight leading-tight">
              Browse Available Listings
            </h1>
            <p className="text-[#64748B] text-base mt-1">
              Surplus food donations matched to your location â€” claimed on a fair, first-come-first-served basis.
            </p>
          </div>

          {/* Search, Filter & Controls Panel */}
          <div className="bg-white border border-[#E7E5E0] rounded-[20px] p-6 shadow-xs space-y-5">
            {/* Search Bar & Location Row */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search food type, restaurant name, or areaâ€¦"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-sm border border-[#E7E5E0] rounded-xl outline-none bg-[#F8F6F3] focus:bg-white focus:border-[#3E5F48] focus:ring-2 focus:ring-[#3E5F48]/20 transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Location Filter Input */}
              <div className="relative w-full md:w-56">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter by city/areaâ€¦"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-sm border border-[#E7E5E0] rounded-xl outline-none bg-[#F8F6F3] focus:bg-white focus:border-[#3E5F48] focus:ring-2 focus:ring-[#3E5F48]/20 transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <SlidersHorizontal className="w-4.5 h-4.5 text-[#64748B] flex-shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full md:w-auto px-4 py-3 text-sm border border-[#E7E5E0] rounded-xl outline-none bg-[#F8F6F3] focus:bg-white focus:border-[#3E5F48] font-medium text-[#1F2D23] cursor-pointer"
                >
                  <option value="latest">Sort: Latest Added</option>
                  <option value="quantity">Sort: Highest Quantity</option>
                  <option value="freshness">Sort: Freshness Duration</option>
                </select>
              </div>
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mr-2 flex-shrink-0">
                Categories:
              </span>
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-150 flex-shrink-0 ${
                      isSelected
                        ? 'bg-[#3E5F48] text-white shadow-xs'
                        : 'bg-[#F8F6F3] text-[#64748B] hover:bg-gray-200/70 border border-[#E7E5E0]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-sm text-[#64748B]">
            <span>
              Showing <strong className="text-[#1F2D23]">{filtered.length}</strong> available listing{filtered.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={fetchListings}
              className="text-xs font-semibold text-[#3E5F48] hover:underline flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Results</span>
            </button>
          </div>

          {/* Listing Cards Grid / Empty State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <RefreshCw className="w-8 h-8 text-[#3E5F48] animate-spin" />
              <p className="text-sm font-medium text-[#64748B]">Loading nearby listingsâ€¦</p>
            </div>
          ) : filtered.length === 0 ? (
            /* Empty State */
            <div className="bg-white border border-[#E7E5E0] rounded-[20px] p-12 text-center shadow-xs flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-[#E8F0E8] text-[#3E5F48] flex items-center justify-center mb-4">
                <Utensils className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2D23] mb-2">
                {search || selectedCategory !== 'All' ? 'No listings match your filters' : 'No food listings available right now'}
              </h3>
              <p className="text-sm text-[#64748B] max-w-md mx-auto mb-6 leading-relaxed">
                {search || selectedCategory !== 'All'
                  ? 'Try clearing your search query or selecting a different category filter.'
                  : 'Check back soon â€” nearby restaurants post fresh surplus food listings throughout the day.'}
              </p>
              {(search || selectedCategory !== 'All' || locationFilter) && (
                <button
                  onClick={() => { setSearch(''); setSelectedCategory('All'); setLocationFilter(''); }}
                  className="bg-[#3E5F48] hover:bg-[#4F6A57] text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-2 mx-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Clear All Filters</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((listing) => {
                const isUrgent = listing.freshFor && (listing.freshFor.includes('1') || listing.freshFor.includes('2'));
                return (
                  <div
                    key={listing._id}
                    className="bg-white border border-[#E7E5E0] rounded-[20px] p-6 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Row: Food Package Icon & Freshness Badge */}
                      <div className="flex items-start justify-between gap-2 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#E8F0E8] text-[#3E5F48] flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:scale-105 transition-transform">
                          <Package className="w-6 h-6" />
                        </div>
                        <div className="flex flex-wrap gap-1.5 justify-end">
                          {isUrgent ? (
                            <span className="bg-amber-50 text-[#D9A441] border border-amber-200 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                              Urgent: {listing.freshFor}
                            </span>
                          ) : (
                            <span className="bg-[#E8F0E8] text-[#3E5F48] text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {listing.freshFor}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Food Name */}
                      <h3 className="font-bold text-[#1F2D23] text-lg mb-1 group-hover:text-[#3E5F48] transition-colors leading-snug">
                        {listing.foodType}
                      </h3>

                      {/* Restaurant Info & Location */}
                      <div className="space-y-1 text-xs text-[#64748B] mb-4">
                        {listing.restaurant && (
                          <p className="font-semibold text-sm text-[#1F2D23]">
                            {listing.restaurant.name}
                          </p>
                        )}
                        <p className="flex items-center gap-1 text-[#64748B]">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{listing.restaurant?.location || 'Location provided upon claim'}</span>
                        </p>
                      </div>

                      {/* Quantity & Impact Card */}
                      <div className="bg-[#F7EDD6] rounded-xl p-3.5 mb-5 border border-amber-200/60 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[#64748B] block text-[11px]">Quantity</span>
                          <span className="font-extrabold text-[#1F2D23] text-sm">{listing.quantity} kg</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[#64748B] block text-[11px]">Servings</span>
                          <span className="font-extrabold text-[#D9A441] text-sm">~{Math.round(listing.quantity * 4)} meals</span>
                        </div>
                      </div>
                    </div>

                    {/* Primary Green Claim CTA Button */}
                    <button
                      onClick={() => handleClaim(listing._id, listing.foodType)}
                      disabled={claimingId === listing._id}
                      className="w-full bg-[#3E5F48] hover:bg-[#4F6A57] text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-xs transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {claimingId === listing._id ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Claimingâ€¦</span>
                        </>
                      ) : (
                        <>
                          <span>Claim Pickup</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
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

export default NgoBrowseListings;


