import { Link } from 'react-router-dom';

function IconInstagram(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconLinkedin(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7 10v7" /><circle cx="7" cy="7" r="0.5" fill="currentColor" />
      <path d="M11 17v-4a2 2 0 0 1 4 0v4" /><path d="M11 10v7" />
    </svg>
  );
}

function IconTwitter(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 5.8c-.7.3-1.5.6-2.3.7a4 4 0 0 0 1.8-2.2 8 8 0 0 1-2.5 1 4 4 0 0 0-6.9 3.6A11.4 11.4 0 0 1 3.9 4.6a4 4 0 0 0 1.2 5.3 4 4 0 0 1-1.8-.5v.1a4 4 0 0 0 3.2 3.9 4 4 0 0 1-1.8.1 4 4 0 0 0 3.7 2.7A8 8 0 0 1 2 17.6a11.3 11.3 0 0 0 6.1 1.8c7.3 0 11.3-6 11.3-11.3v-.5c.8-.6 1.4-1.3 1.9-2.1z" />
    </svg>
  );
}

function IconMail(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6 8.5 7 8.5-7" />
    </svg>
  );
}

function IconPhone(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 2-2z" />
    </svg>
  );
}

function IconMapPin(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  );
}

function IconLeaf(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 20c8 0 16-4 16-16-9 0-16 5-16 16z" />
      <path d="M4 20c3-6 7-10 13-13" />
    </svg>
  );
}

const LINK_CLASS = "text-[#6B7280] hover:text-[#3E5F48] transition-colors duration-150 no-underline text-sm leading-relaxed";

const SOCIAL_LINKS = [
  { icon: IconInstagram, label: 'Instagram', href: '#' },
  { icon: IconLinkedin, label: 'LinkedIn', href: '#' },
  { icon: IconTwitter, label: 'Twitter / X', href: '#' },
];

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="font-sans border-t border-[#E7E5E0]"
      style={{ background: 'linear-gradient(180deg, #F8F6F3 0%, #F4F2EB 100%)' }}
      aria-label="Site footer"
    >
      {/* Main grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
        {/* Brand */}
        <div className="sm:col-span-2 md:col-span-1">
          <Link to="/" className="no-underline flex items-center gap-2 mb-3 group">
            <div className="w-8 h-8 rounded-lg bg-[#3E5F48] flex items-center justify-center shadow-xs">
              <IconLeaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-[#1F2D23] font-extrabold text-lg tracking-tight">
              Food<span className="text-[#3E5F48]">Bridge</span>
            </span>
          </Link>
          <p className="text-[#6B7280] text-sm leading-relaxed mb-4 sm:mb-5 max-w-xs sm:max-w-[200px]">
            Connecting surplus food with communities who need it — one listing at a time.
          </p>
          <div className="flex gap-2.5">
            {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-xl bg-white border border-[#E7E5E0] shadow-2xs flex items-center justify-center text-[#6B7280] hover:text-[#3E5F48] hover:border-[#3E5F48]/40 hover:bg-[#E8F0E8] transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <p className="text-[#1F2D23] text-xs font-bold mb-4 uppercase tracking-wider">Platform</p>
          <ul className="flex flex-col gap-2.5">
            {[
              { to: '/', label: 'Home' },
              { to: '/about', label: 'About Us' },
              { to: '/contact', label: 'Contact' },
              { to: '/start', label: 'Get Started' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={LINK_CLASS}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* For Users */}
        <div>
          <p className="text-[#1F2D23] text-xs font-bold mb-4 uppercase tracking-wider">For Users</p>
          <ul className="flex flex-col gap-2.5">
            {[
              { to: '/restaurant', label: 'Restaurants' },
              { to: '/ngo', label: 'NGOs' },
              { to: '/admin', label: 'Admin Login' },
              { to: '/restaurant?mode=login', label: 'Sign In' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={LINK_CLASS}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-[#1F2D23] text-xs font-bold mb-4 uppercase tracking-wider">Contact Us</p>
          <ul className="flex flex-col gap-3 text-[#6B7280] text-sm">
            <li className="flex items-start gap-2.5">
              <IconMail className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#3E5F48]" />
              <span>support@foodbridge.org</span>
            </li>
            <li className="flex items-start gap-2.5">
              <IconPhone className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#3E5F48]" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-start gap-2.5">
              <IconMapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#3E5F48]" />
              <span>Mumbai, Maharashtra, India</span>
            </li>
          </ul>

          {/* Impact tag */}
          <div className="mt-5 inline-flex items-center gap-2 bg-[#E8F0E8] border border-[#3E5F48]/20 rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3E5F48] animate-pulse" />
            <span className="text-[#3E5F48] text-xs font-semibold">Platform is live</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#E7E5E0] bg-[#F4F2EB]/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[#8A8F87] text-xs">
            &copy; {year} FoodBridge. All rights reserved.
          </p>
          <p className="text-xs text-[#3E5F48] font-medium">
            🌿 Together for a hunger-free tomorrow
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;