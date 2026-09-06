import { useParams, useNavigate, Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

function IconUtensils(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 2v7c0 1.7 1.3 3 3 3s3-1.3 3-3V2"/>
      <path d="M6 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6h5"/>
      <path d="M18 22V12"/>
    </svg>
  );
}

function IconUsers(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="8" r="3.2"/>
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0"/>
      <path d="M16 8.5a3 3 0 1 1 0 6"/>
      <path d="M17.5 14.3c2 .5 3.5 2 3.5 5.7"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

const CARDS = [
  {
    role: 'restaurant',
    icon: IconUtensils,
    emoji: '🍽️',
    title: "I'm a Restaurant",
    tagline: 'Turn surplus into smiles.',
    description: 'Post surplus food in seconds and let nearby NGOs claim it before it goes to waste.',
    features: ['Takes under a minute to post', 'Real-time NGO notifications', 'Track your impact instantly'],
    action: 'Continue as Restaurant',
    accent: 'primary',
    bg: 'from-[#E8F0E8]/80 via-[#F6F8F3]/60 to-white',
    border: 'border-primary/20 hover:border-primary/50',
    iconBg: 'bg-primary',
    pillBg: 'bg-primary-light text-primary-dark',
    pillHover: 'hover:bg-primary hover:text-white',
    path: (mode) => `/restaurant?mode=${mode}`,
  },
  {
    role: 'ngo',
    icon: IconUsers,
    emoji: '🤝',
    title: "I'm an NGO",
    tagline: 'Get food. Serve communities.',
    description: 'Get notified the moment surplus food is posted nearby and claim it, fairly and fast.',
    features: ['Instant proximity alerts', 'Fair first-come-first-served', 'Always free — no hidden charges'],
    action: 'Continue as NGO',
    accent: 'secondary',
    bg: 'from-[#F4EDE3]/80 via-[#F7F3EA]/60 to-white',
    border: 'border-secondary/20 hover:border-secondary/50',
    iconBg: 'bg-secondary',
    pillBg: 'bg-secondary-light text-secondary-dark',
    pillHover: 'hover:bg-secondary hover:text-white',
    path: (mode) => `/ngo?mode=${mode}`,
  },
];

function RoleSelect() {
  const { mode: modeParam } = useParams();
  const navigate = useNavigate();
  const mode = modeParam || 'register';
  const label = mode === 'login' ? 'Sign In' : 'Get Started';

  return (
    <PageTransition>
      <div className="font-sans">
        {/* Hero banner (matches Home page bright cream/sand theme) */}
        <section className="relative text-center py-10 sm:py-12 px-4 sm:px-6 overflow-hidden" style={{ background: 'linear-gradient(135deg, #F8F6F3 0%, #F4F2EB 40%, #E8F0E8 80%, #F4EDE3 100%)' }}>
          <div className="blob-float absolute -top-16 -left-10 w-48 h-48 rounded-full bg-[#7E9B7A]/15 blur-3xl pointer-events-none" />
          <div className="blob-float absolute -bottom-16 -right-10 w-48 h-48 rounded-full bg-[#D9A441]/10 blur-3xl pointer-events-none" style={{ animationDelay: '4s' }} />

          <div className="relative">
            <Link to="/" className="inline-flex items-center gap-1 text-[#6B7280] text-xs hover:text-[#3E5F48] transition-colors duration-150 mb-2">
              ← Back to home
            </Link>
            <div className="inline-flex items-center gap-2 bg-[#3E5F48]/10 border border-[#3E5F48]/20 text-[#3E5F48] text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider block mx-auto w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3E5F48] animate-pulse" />
              Choose Your Role
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1F2D23] mb-1.5">{label}</h1>
            <p className="text-[#6B7280] text-xs sm:text-sm max-w-sm mx-auto">Tell us who you are — we'll take you to the right place.</p>
          </div>
          {/* Wave divider */}
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"
            className="absolute bottom-0 left-0 w-full h-8 md:h-10 pointer-events-none">
            <path d="M0,80 C360,30 720,110 1440,50 L1440,120 L0,120 Z" fill="#F8F6F3" />
          </svg>
        </section>

        {/* Cards */}
        <section className="bg-fb-gradient py-10 sm:py-12 px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-3xl mx-auto">
            {CARDS.map((card) => (
              <button
                key={card.role}
                onClick={() => navigate(card.path(mode))}
                className={`group card-hover text-left bg-gradient-to-br ${card.bg} border ${card.border} shadow-fb-card rounded-3xl p-5 sm:p-7 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${card.accent === 'primary' ? 'focus-visible:ring-primary' : 'focus-visible:ring-secondary'}`}
              >
                {/* Icon */}
                <div className={`w-14 sm:w-16 h-14 sm:h-16 rounded-2xl ${card.iconBg} flex items-center justify-center mb-4 sm:mb-5 shadow-md transition-transform duration-200 group-hover:scale-110`}>
                  <card.icon className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
                </div>

                {/* Title */}
                <p className="text-lg sm:text-xl font-extrabold text-ink mb-0.5">{card.title}</p>
                <p className={`text-xs sm:text-sm font-semibold mb-2.5 sm:mb-3 ${card.accent === 'primary' ? 'text-primary-dark' : 'text-secondary-dark'}`}>
                  {card.tagline}
                </p>
                <p className="text-ink-soft text-xs sm:text-sm mb-4 sm:mb-5 leading-relaxed">{card.description}</p>

                {/* Feature bullets */}
                <ul className="flex flex-col gap-1.5 mb-5 sm:mb-6">
                  {card.features.map(f => (
                    <li key={f} className="flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm text-ink">
                      <span className={`w-4 sm:w-5 h-4 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 ${card.accent === 'primary' ? 'bg-primary text-white' : 'bg-secondary text-white'}`}>
                        <CheckIcon />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA pill */}
                <span className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 ${card.pillBg} ${card.pillHover} group-hover:gap-2.5`}>
                  {card.action} <span>→</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

export default RoleSelect;
