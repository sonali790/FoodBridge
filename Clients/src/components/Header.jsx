import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';

function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="10" fill="#3E5F48" />
      <path d="M8 22 C8 14 16 10 24 12" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <path d="M8 22 C12 20 20 18 24 12" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <circle cx="24" cy="12" r="2.5" fill="#D9A441"/>
    </svg>
  );
}

function MenuIcon({ open }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      {open ? (
        <>
          <line x1="17" y1="5" x2="5" y2="17" />
          <line x1="5" y1="5" x2="17" y2="17" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="19" y2="6" />
          <line x1="3" y1="11" x2="19" y2="11" />
          <line x1="3" y1="16" x2="19" y2="16" />
        </>
      )}
    </svg>
  );
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [signInOpen, setSignInOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close sign-in dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('#signin-dropdown-container')) {
        setSignInOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Scroll spy implementation for Home, About, Contact
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);

      if (location.pathname === '/') {
        const scrollPos = window.scrollY + 180;
        const contactEl = document.getElementById('contact');
        const aboutEl = document.getElementById('about');

        if (contactEl && scrollPos >= contactEl.offsetTop) {
          setActiveSection('contact');
        } else if (aboutEl && scrollPos >= aboutEl.offsetTop) {
          setActiveSection('about');
        } else {
          setActiveSection('home');
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  useEffect(() => {
    setMobileOpen(false);
    setSignInOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navItems = [
    { id: 'home', label: 'Home', to: '/' },
    { id: 'about', label: 'About', to: '/about' },
    { id: 'contact', label: 'Contact', to: '/contact' },
  ];

  const handleNavClick = (id, to, e) => {
    e.preventDefault();
    setMobileOpen(false);

    if (location.pathname === '/') {
      if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveSection('home');
      } else {
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          setActiveSection(id);
        }
      }
    } else {
      navigate(to);
    }
  };

  const isSignInActive =
    (location.pathname === '/restaurant' && location.search.includes('mode=login')) ||
    (location.pathname === '/ngo' && location.search.includes('mode=login')) ||
    location.pathname === '/admin';

  return (
    <>
      <header
        className={`sticky top-0 z-40 font-sans transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-[#E7E5E0] shadow-xs'
            : 'bg-white/80 backdrop-blur-md border-b border-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 md:px-8 h-16">
          {/* Logo */}
          <Link
            to="/"
            onClick={(e) => handleNavClick('home', '/', e)}
            className="flex items-center gap-2.5 no-underline group"
            aria-label="FoodBridge Home"
          >
            <LogoMark />
            <span className="text-[18px] font-extrabold text-ink tracking-tight leading-none">
              Food<span className="text-primary">Bridge</span>
            </span>
          </Link>

          {/* Desktop nav with smooth Scroll Spy */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive =
                location.pathname === '/'
                  ? activeSection === item.id
                  : location.pathname === item.to;

              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(item.id, item.to, e)}
                  className={`relative no-underline px-1 py-1.5 text-sm font-medium transition-colors duration-200 nav-link-underline cursor-pointer ${
                    isActive ? 'text-primary-dark font-semibold active' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Sign In Dropdown */}
            <div id="signin-dropdown-container" className="relative">
              <button
                type="button"
                onClick={() => setSignInOpen((prev) => !prev)}
                className={`no-underline px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isSignInActive || signInOpen
                    ? 'bg-primary-light text-primary-dark font-bold'
                    : 'text-ink-soft hover:text-ink hover:bg-gray-100'
                }`}
                aria-expanded={signInOpen}
                aria-haspopup="true"
              >
                Sign In
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${signInOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {signInOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E7E5E0] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-1.5 border-b border-gray-100">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Select Portal</p>
                  </div>
                  <Link
                    to="/restaurant?mode=login"
                    onClick={() => setSignInOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold text-[#1F2D23] hover:bg-[#E8F0E8] hover:text-[#3E5F48] transition-colors no-underline"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#3E5F48]/10 text-[#3E5F48] flex items-center justify-center text-xs font-bold">
                      🍽️
                    </div>
                    <div>
                      <div>Restaurant Login</div>
                      <p className="text-[11px] font-normal text-gray-500">Post & donate surplus</p>
                    </div>
                  </Link>

                  <Link
                    to="/ngo?mode=login"
                    onClick={() => setSignInOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold text-[#1F2D23] hover:bg-[#F4EDE3] hover:text-[#D9A441] transition-colors no-underline"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#D9A441]/15 text-[#D9A441] flex items-center justify-center text-xs font-bold">
                      🤝
                    </div>
                    <div>
                      <div>NGO Login</div>
                      <p className="text-[11px] font-normal text-gray-500">Claim & collect food</p>
                    </div>
                  </Link>

                  <div className="border-t border-gray-100 my-1"></div>

                  <Link
                    to="/admin"
                    onClick={() => setSignInOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors no-underline"
                  >
                    <div className="w-6 h-6 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center text-xs">
                      🔒
                    </div>
                    <span>Admin Portal</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/start"
              className="btn-shine relative overflow-hidden bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-full no-underline text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 glow-green shadow-xs"
            >
              Get Started →
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl text-ink hover:bg-gray-100 transition-colors duration-150"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="drawer-overlay md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-72 bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out font-sans ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2 no-underline" onClick={() => setMobileOpen(false)}>
            <LogoMark />
            <span className="text-base font-extrabold text-ink">
              Food<span className="text-primary">Bridge</span>
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-xl text-ink hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <MenuIcon open />
          </button>
        </div>

        {/* Drawer links */}
        <nav className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto" aria-label="Mobile navigation">
          {navItems.map((item) => {
            const isActive =
              location.pathname === '/'
                ? activeSection === item.id
                : location.pathname === item.to;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(item.id, item.to, e)}
                className={`no-underline flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary-light text-primary-dark font-semibold'
                    : 'text-ink hover:bg-gray-50'
                }`}
              >
                {item.label}
              </a>
            );
          })}

          <div className="border-t border-gray-100 my-2" />

          {/* Dedicated Sign In Options for Mobile */}
          <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sign In</p>
          <Link
            to="/restaurant?mode=login"
            onClick={() => setMobileOpen(false)}
            className="no-underline flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-ink hover:bg-gray-50 transition-all duration-150"
          >
            <span>🍽️</span> Restaurant Login
          </Link>
          <Link
            to="/ngo?mode=login"
            onClick={() => setMobileOpen(false)}
            className="no-underline flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-ink hover:bg-gray-50 transition-all duration-150"
          >
            <span>🤝</span> NGO Login
          </Link>
          <Link
            to="/admin"
            onClick={() => setMobileOpen(false)}
            className="no-underline flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs text-gray-500 hover:bg-gray-50 transition-all duration-150"
          >
            <span>🔒</span> Admin Portal
          </Link>

          <div className="border-t border-gray-100 my-2" />

          {/* Get Started Button */}
          <Link
            to="/start"
            onClick={() => setMobileOpen(false)}
            className="no-underline flex items-center justify-center gap-2 bg-primary text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-all duration-150 mt-1"
          >
            Get Started Free →
          </Link>
        </nav>

        {/* Drawer footer */}
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-ink-soft text-center">🌿 Good food. Stronger communities.</p>
        </div>
      </div>
    </>
  );
}

export default Header;
