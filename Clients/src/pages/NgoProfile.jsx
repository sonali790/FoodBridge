import { useState } from 'react';
import NgoLayout from '../components/NgoLayout';
import PageTransition from '../components/PageTransition';
import {
  HeartHandshake,
  ShieldCheck,
  Building2,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Users,
  Utensils,
  CheckCircle2,
  Phone,
  Edit2,
  Check
} from 'lucide-react';

function NgoProfile() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(localStorage.getItem('name') || 'Asha Foundation NGO');

  const handleSave = () => {
    localStorage.setItem('name', name);
    setEditing(false);
  };

  return (
    <NgoLayout>
      <PageTransition>
        <div className="space-y-8 font-sans bg-[#F8F6F3] text-[#1F2D23]">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#D9A441] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-100" />
                <span>ORGANIZATION PROFILE</span>
              </div>
              <h1 className="text-[34px] font-extrabold text-[#1F2D23] tracking-tight leading-tight">
                NGO Profile & Impact
              </h1>
              <p className="text-[#64748B] text-base mt-1">
                Verified non-profit organization details, impact statistics, and service region info.
              </p>
            </div>

            <button
              onClick={() => (editing ? handleSave() : setEditing(true))}
              className="bg-[#3E5F48] hover:bg-[#4F6A57] text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 self-start sm:self-center active:scale-95"
            >
              {editing ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Profile</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </>
              )}
            </button>
          </div>

          {/* Main Organization Banner Card */}
          <div className="bg-white border border-[#E7E5E0] rounded-[20px] p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Avatar Logo */}
              <div className="w-20 h-20 rounded-2xl bg-[#E8F0E8] text-[#3E5F48] flex items-center justify-center font-bold text-2xl border border-[#D8E9D4] flex-shrink-0 shadow-xs">
                <HeartHandshake className="w-10 h-10 text-[#3E5F48]" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {editing ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="text-2xl font-extrabold text-[#1F2D23] border border-[#E7E5E0] rounded-xl px-3 py-1 bg-[#F8F6F3] outline-none focus:border-[#3E5F48]"
                    />
                  ) : (
                    <h2 className="text-2xl font-extrabold text-[#1F2D23]">{name}</h2>
                  )}
                  <span className="bg-[#E2EDE5] text-[#3E5F48] border border-[#B8CDB4] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#3E5F48]" />
                    Verified Non-Profit
                  </span>
                </div>
                <p className="text-sm text-[#64748B] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span>Registered Food Relief NGO Partner</span>
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white border border-[#E7E5E0] rounded-[20px] p-6 shadow-xs flex items-center gap-4 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-full bg-[#E8F0E8] text-[#3E5F48] flex items-center justify-center flex-shrink-0">
                <Utensils className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[30px] font-extrabold text-[#1F2D23] leading-tight">12,500+</p>
                <p className="text-sm font-medium text-[#64748B]">Meals Served</p>
              </div>
            </div>

            <div className="bg-white border border-[#E7E5E0] rounded-[20px] p-6 shadow-xs flex items-center gap-4 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-[#D9A441] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[30px] font-extrabold text-[#1F2D23] leading-tight">340+</p>
                <p className="text-sm font-medium text-[#64748B]">Completed Pickups</p>
              </div>
            </div>

            <div className="bg-white border border-[#E7E5E0] rounded-[20px] p-6 shadow-xs flex items-center gap-4 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-full bg-[#F7EDD6] text-[#D9A441] flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[30px] font-extrabold text-[#1F2D23] leading-tight">45+</p>
                <p className="text-sm font-medium text-[#64748B]">Partner Restaurants</p>
              </div>
            </div>
          </div>

          {/* Detailed Info Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Contact & Service Area Details */}
            <div className="bg-white border border-[#E7E5E0] rounded-[20px] p-6 shadow-xs space-y-5">
              <h3 className="text-lg font-bold text-[#1F2D23]">Organization Contact & Service Area</h3>
              
              <div className="space-y-4 text-sm text-[#64748B]">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#3E5F48] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#1F2D23] block">Email Address</span>
                    <span>contact@{name.toLowerCase().replace(/[^a-z0-9]/g, '')}.org</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#3E5F48] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#1F2D23] block">Helpline / Contact Phone</span>
                    <span>+91 98765 43210</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#3E5F48] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#1F2D23] block">Primary Service Region</span>
                    <span>Mumbai Central & Suburban Regions, Maharashtra</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#3E5F48] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#1F2D23] block">Operating / Pickup Hours</span>
                    <span>8:00 AM – 10:30 PM (7 days a week)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission & Acceptance Preferences */}
            <div className="bg-white border border-[#E7E5E0] rounded-[20px] p-6 shadow-xs space-y-5">
              <h3 className="text-lg font-bold text-[#1F2D23]">About & Food Acceptance</h3>

              <div className="space-y-4 text-sm text-[#64748B]">
                <div>
                  <span className="font-semibold text-[#1F2D23] block mb-1">About Our Cause</span>
                  <p className="leading-relaxed">
                    Dedicated to fighting urban hunger by bridging surplus food from local commercial kitchens and restaurants directly to community shelters, orphanages, and daily wage workers.
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-[#1F2D23] block mb-1">Accepted Food Categories</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {['Vegetarian Meals', 'Non-Vegetarian Meals', 'Dry Rations', 'Packaged Sweets', 'Fresh Cooked Rice & Curry'].map((pref) => (
                      <span key={pref} className="bg-[#E2EDE5] text-[#3E5F48] border border-[#B8CDB4] text-xs font-bold px-3 py-1 rounded-full">
                        ✓ {pref}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </PageTransition>
    </NgoLayout>
  );
}

export default NgoProfile;
