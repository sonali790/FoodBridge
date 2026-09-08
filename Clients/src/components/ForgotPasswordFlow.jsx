import { API_BASE_URL } from '../config/api';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PasswordRequirements from './PasswordRequirements';
import { isPasswordStrong } from '../utils/passwordValidation';
import Button from './Button';
import PageTransition from './PageTransition';
import AuthVisual from './AuthVisual';
import { IconMail, IconLock, IconKey } from './AuthIcons';
import { useToast } from './ToastContext';

const THEME = {
  restaurant: {
    heroTitle: 'ðŸ½ï¸ Restaurant Password Reset',
    loginPath: '/restaurant?mode=login',
    accent: 'primary',
    gradient: 'from-primary-light/60 via-white to-secondary-light/50',
  },
  ngo: {
    heroTitle: 'ðŸ¤ NGO Password Reset',
    loginPath: '/ngo?mode=login',
    accent: 'secondary',
    gradient: 'from-secondary-light/60 via-white to-primary-light/50',
  },
};

// role: 'restaurant' | 'ngo'
function ForgotPasswordFlow({ role }) {
  const theme = THEME[role];
  const accent = theme.accent; // 'primary' | 'secondary'
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState('email'); // 'email' | 'reset' | 'done'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputWrapClass = "relative";
  const iconClass = `absolute left-3.5 top-1/2 -translate-y-1/2 text-${accent}/70 pointer-events-none`;
  const inputClass = `w-full border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 outline-none bg-white/70 focus:border-${accent} focus:ring-4 focus:ring-${accent}/15 transition-all duration-200`;

  const eyeBtnClass = `border border-gray-200 rounded-xl px-3 text-${accent} flex items-center justify-center hover:bg-${accent}-light/50 transition-colors duration-150`;

  const EyeIcon = ({ shown }) =>
    shown ? (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
    ) : (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
    );

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/${role}/forgot-password`, { email });
      showToast('If that email is registered, a reset code has been sent.', 'success');
      setStep('reset');
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!isPasswordStrong(newPassword)) {
      showToast('Please meet all password requirements.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/${role}/reset-password`, {
        email, otp, newPassword,
      });
      setStep('done');
      showToast('Password reset successful!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="font-sans min-h-[calc(100vh-140px)] flex items-center justify-center py-8 px-4" style={{ background: 'linear-gradient(135deg, #F2F7F2 0%, #FAF9F6 45%, #F7F2EB 100%)' }}>
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 rounded-3xl overflow-hidden shadow-premium border border-[#E7E5E0] bg-white">
          <div className="md:col-span-5">
            <AuthVisual role="reset" />
          </div>

          <div className="md:col-span-7 p-6 md:p-8 bg-white">
            <Link to="/" className={`text-ink-soft text-xs hover:text-${accent} transition-colors duration-150`}>&larr; Back to home</Link>
            <h1 className="text-2xl font-extrabold mt-2 mb-5 text-ink">{theme.heroTitle}</h1>

            {step === 'email' && (
              <form onSubmit={handleRequestOtp} className="flex flex-col gap-4 fade-in-up">
                <p className="text-sm text-ink-soft">
                  Enter your registered email and we'll send you a code to reset your password.
                </p>
                <div className={inputWrapClass}>
                  <IconMail width={18} height={18} className={iconClass} />
                  <input
                    type="email" placeholder="Email" value={email}
                    onChange={(e) => setEmail(e.target.value)} required className={inputClass}
                  />
                </div>
                <Button type="submit" variant={accent === 'primary' ? 'primary' : 'secondary'} loading={loading} className="w-full">
                  Send Reset Code
                </Button>
              </form>
            )}

            {step === 'reset' && (
              <form onSubmit={handleResetPassword} className="flex flex-col gap-4 fade-in-up">
                <p className="text-sm text-ink-soft">
                  Enter the code sent to <strong className="text-ink">{email}</strong> and choose a new password.
                </p>
                <div className={inputWrapClass}>
                  <IconKey width={18} height={18} className={iconClass} />
                  <input
                    type="text" placeholder="6-digit code" value={otp}
                    onChange={(e) => setOtp(e.target.value)} required maxLength={6} className={inputClass}
                  />
                </div>

                <div className="flex gap-2">
                  <div className={`${inputWrapClass} flex-1`}>
                    <IconLock width={18} height={18} className={iconClass} />
                    <input
                      type={showNewPassword ? 'text' : 'password'} placeholder="New password" value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      required className={inputClass}
                    />
                  </div>
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className={eyeBtnClass}>
                    <EyeIcon shown={showNewPassword} />
                  </button>
                </div>

                <PasswordRequirements password={newPassword} visible={passwordFocused || newPassword.length > 0} />

                <div className="flex gap-2">
                  <div className={`${inputWrapClass} flex-1`}>
                    <IconLock width={18} height={18} className={iconClass} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm new password" value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)} required className={inputClass}
                    />
                  </div>
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={eyeBtnClass}>
                    <EyeIcon shown={showConfirmPassword} />
                  </button>
                </div>

                <Button type="submit" variant={accent === 'primary' ? 'primary' : 'secondary'} loading={loading} className="w-full">
                  Reset Password
                </Button>
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className={`text-center text-xs hover:underline text-${accent}`}
                >
                  Didn't get a code? Try again
                </button>
              </form>
            )}

            {step === 'done' && (
              <div className="flex flex-col gap-4 items-center text-center fade-in-up py-6">
                <div className={`w-14 h-14 rounded-full bg-${accent}-light flex items-center justify-center`}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`text-${accent === 'primary' ? 'primary-dark' : 'secondary-dark'}`}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-ink font-medium">Password reset successful!</p>
                <p className="text-ink-soft text-sm">You can now log in with your new password.</p>
                <Button
                  variant={accent === 'primary' ? 'primary' : 'secondary'}
                  onClick={() => navigate(theme.loginPath)}
                  className="mt-2"
                >
                  Go to Login
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default ForgotPasswordFlow;


