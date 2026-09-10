import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PasswordRequirements from '../components/PasswordRequirements';
import { isPasswordStrong } from '../utils/passwordValidation';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';
import AuthVisual from '../components/AuthVisual';
import { IconUser, IconMail, IconLock, IconMapPin, IconLeaf, IconUsersGroup } from '../components/AuthIcons';
import { useToast } from '../components/ToastContext';

const STATES = [
  'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'West Bengal',
  'Rajasthan', 'Uttar Pradesh', 'Telangana', 'Kerala', 'Punjab', 'Haryana'
];

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

const inputWrapClass = 'relative';
const iconClass = 'absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary/60 pointer-events-none';
const inputClass = 'w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none bg-white focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all duration-200 placeholder:text-gray-400';

function NgoPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') === 'login');
  const [form, setForm] = useState({ name: '', email: '', password: '', location: '', foodTypeNeeded: 'any', peopleServed: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && !isPasswordStrong(form.password)) {
      showToast('Please meet all password requirements.', 'error');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        const res = await axios.post('/api/ngo/login', {
          email: form.email, password: form.password
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', 'ngo');
        localStorage.setItem('name', res.data.ngo.name);
        showToast(`Welcome back, ${res.data.ngo.name}!`, 'success');
        navigate('/ngo/dashboard');
      } else {
        const res = await axios.post('/api/ngo/register', {
          ...form, peopleServed: Number(form.peopleServed)
        });
        showToast(res.data.message, 'success');
        setIsLogin(true);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="font-sans min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 px-4" style={{ background: 'linear-gradient(135deg, #F2F7F2 0%, #FAF9F6 45%, #F7F2EB 100%)' }}>
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 rounded-3xl overflow-hidden shadow-premium border border-[#E7E5E0] bg-white">
          <div className="md:col-span-5">
            <AuthVisual role="ngo" />
          </div>

          <div className="md:col-span-7 p-6 md:p-8 bg-white">
            <Link to="/" className="inline-flex items-center gap-1 text-ink-soft text-xs hover:text-secondary transition-colors duration-150 mb-4">
              ← Back to home
            </Link>

            {/* Header */}
            <div className="mb-5">
              <div className="w-10 h-10 rounded-xl bg-secondary-light flex items-center justify-center mb-2">
                <span className="text-xl">🤝</span>
              </div>
              <h1 className="text-2xl font-extrabold text-ink leading-tight">
                NGO {isLogin ? 'Login' : 'Registration'}
              </h1>
              <p className="text-ink-soft text-xs mt-1">
                {isLogin ? 'Welcome back! Sign in to your NGO account.' : 'Register your NGO and start claiming food listings today.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {!isLogin && (
                <div className={inputWrapClass}>
                  <IconUser width={18} height={18} className={iconClass} />
                  <input name="name" placeholder="NGO Name" value={form.name} onChange={handleChange} required className={inputClass} />
                </div>
              )}

              <div className={inputWrapClass}>
                <IconMail width={18} height={18} className={iconClass} />
                <input name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} required className={inputClass} />
              </div>

              <div className="flex gap-2">
                <div className={`${inputWrapClass} flex-1`}>
                  <IconLock width={18} height={18} className={iconClass} />
                  <input
                    name="password" type={showPassword ? 'text' : 'password'} placeholder="Password"
                    value={form.password} onChange={handleChange} required className={inputClass}
                    onFocus={() => setPasswordFocused(true)} onBlur={() => setPasswordFocused(false)}
                  />
                </div>
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="w-12 border border-gray-200 rounded-xl text-ink-soft flex items-center justify-center hover:bg-secondary-light hover:text-secondary-dark hover:border-secondary/30 transition-all duration-150">
                  <EyeIcon visible={showPassword} />
                </button>
              </div>

              {!isLogin && (
                <PasswordRequirements password={form.password} visible={passwordFocused || form.password.length > 0} />
              )}

              {isLogin && (
                <Link to="/ngo/forgot-password" className="text-secondary text-xs text-right -mt-1 hover:underline font-medium">
                  Forgot Password?
                </Link>
              )}

              {!isLogin && (
                <>
                  <div className={inputWrapClass}>
                    <IconMapPin width={18} height={18} className={iconClass} />
                    <select name="location" value={form.location} onChange={handleChange} required className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="">Select State</option>
                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className={inputWrapClass}>
                    <IconLeaf width={18} height={18} className={iconClass} />
                    <select name="foodTypeNeeded" value={form.foodTypeNeeded} onChange={handleChange} className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="any">Any food type</option>
                      <option value="veg">Vegetarian only</option>
                      <option value="non-veg">Non-vegetarian only</option>
                    </select>
                  </div>
                  <div className={inputWrapClass}>
                    <IconUsersGroup width={18} height={18} className={iconClass} />
                    <input name="peopleServed" type="number" placeholder="People served daily (approx.)" value={form.peopleServed} onChange={handleChange} required className={inputClass} />
                  </div>
                </>
              )}

              <Button type="submit" variant="secondary" loading={loading} className="w-full mt-1">
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-ink-soft hover:text-secondary transition-colors duration-150">
                {isLogin
                  ? <span>Don't have an account? <span className="text-secondary font-semibold">Register</span></span>
                  : <span>Already registered? <span className="text-secondary font-semibold">Sign In</span></span>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default NgoPage;
