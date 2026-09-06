import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';
import { useToast } from '../components/ToastContext';
import { IconMail, IconLock } from '../components/AuthIcons';

function EyeIcon({ visible }) {
  return visible ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function AdminPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', 'admin');
      showToast(`Welcome, ${res.data.admin.name}`, 'success');
      navigate('/admin/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputWrap = 'relative';
  const iconCls = 'absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/60 pointer-events-none';
  const inputCls = 'w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 placeholder:text-gray-400';

  return (
    <PageTransition>
      <div className="font-sans min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 px-4" style={{ background: 'linear-gradient(135deg, #F2F7F2 0%, #FAF9F6 45%, #F7F2EB 100%)' }}>
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-premium border border-[#E7E5E0] overflow-hidden">
            {/* Top banner (Home page cream/sand theme) */}
            <div
              className="relative px-6 py-6 text-center overflow-hidden border-b border-[#E7E5E0]"
              style={{ background: 'linear-gradient(135deg, #E8DDD9 0%, #F4F2EB 50%, #DCD7C3 100%)' }}
            >
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#7E9B7A]/15 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-[#D9A441]/10 blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="w-11 h-11 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs flex items-center justify-center mx-auto mb-2.5">
                  <span className="text-xl">🔐</span>
                </div>
                <h1 className="text-xl font-extrabold text-[#1F2D23] mb-0.5">Admin Login</h1>
                <p className="text-[#6B7280] text-xs">Restricted access — authorised personnel only.</p>
              </div>
            </div>

            {/* Form */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className={inputWrap}>
                  <IconMail width={18} height={18} className={iconCls} />
                  <input name="email" type="email" placeholder="Admin Email" value={form.email} onChange={handleChange} required className={inputCls} />
                </div>

                <div className="flex gap-2">
                  <div className={`${inputWrap} flex-1`}>
                    <IconLock width={18} height={18} className={iconCls} />
                    <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={handleChange} required className={inputCls} />
                  </div>
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="w-12 border border-gray-200 rounded-xl text-ink-soft flex items-center justify-center hover:bg-primary-light hover:text-primary-dark hover:border-primary/30 transition-all duration-150">
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>

                <Button type="submit" variant="primary" loading={loading} className="w-full mt-2">
                  Sign In to Admin Panel
                </Button>
              </form>

              <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                <Link to="/" className="text-xs text-ink-soft hover:text-primary transition-colors duration-150">
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>

          {/* Security note */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-ink-soft">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2l8 3.5v6c0 5-3.4 8.5-8 10.5C7.4 20 4 16.5 4 11.5v-6z"/>
            </svg>
            Secured with JWT authentication
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default AdminPage;
