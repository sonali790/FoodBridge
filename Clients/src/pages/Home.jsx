import { Link } from 'react-router-dom';
import useOnScreen from '../hooks/useOnScreen';
import useCountUp from '../hooks/useCountUp';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';
import homeImage from '../assets/home.png';

/* ── Local SVG icons ── */
function Ico({ d, ...p }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      {d}
    </svg>
  );
}
const IconStore     = (p) => <Ico {...p} d={<><path d="M3 9l1.5-5h15L21 9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 9v10h14V9"/><path d="M10 19v-5h4v5"/></>} />;
const IconUsers     = (p) => <Ico {...p} d={<><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 8.5a3 3 0 1 1 0 6"/><path d="M17.5 14.3c2 .5 3.5 2 3.5 5.7"/></>} />;
const IconLeaf      = (p) => <Ico {...p} d={<><path d="M4 20c8 0 16-4 16-16-9 0-16 5-16 16z"/><path d="M4 20c3-6 7-10 13-13"/></>} />;
const IconGlobe     = (p) => <Ico {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c3 3.5 3 14.5 0 18"/><path d="M12 3c-3 3.5-3 14.5 0 18"/></>} />;
const IconClipboard = (p) => <Ico {...p} d={<><rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><path d="M9 12h6"/><path d="M9 16h6"/></>} />;
const IconBellRing  = (p) => <Ico {...p} d={<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M4 4l2 2"/><path d="M20 4l-2 2"/></>} />;
const IconPackage   = (p) => <Ico {...p} d={<><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></>} />;
const IconMapPin    = (p) => <Ico {...p} d={<><path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.3"/></>} />;
const IconShield    = (p) => <Ico {...p} d={<><path d="M12 2l8 3.5v6c0 5-3.4 8.5-8 10.5C7.4 20 4 16.5 4 11.5v-6z"/><path d="M9 12l2 2 4-4.5"/></>} />;
const IconBolt      = (p) => <Ico {...p} d={<><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></>} />;
const IconGift      = (p) => <Ico {...p} d={<><rect x="3" y="8" width="18" height="13" rx="1"/><path d="M3 12h18"/><path d="M12 8v13"/><path d="M12 8C10 4 6 4 6 6.5S9 8 12 8z"/><path d="M12 8c2-4 6-4 6-1.5S15 8 12 8z"/></>} />;
const IconStar      = (p) => <Ico {...p} d={<><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>} />;
const IconTruck     = (p) => <Ico {...p} d={<><rect x="1" y="6" width="13" height="11" rx="1"/><path d="M14 10h4l3 3v4h-7z"/><circle cx="6" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/></>} />;
const IconCheck     = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>;
const IconHeart     = (p) => <Ico {...p} d={<><path d="M12 20.5s-7.5-4.6-10-9.3C.5 7.8 2.4 4.5 6 4.5c2 0 3.4 1 4 2.4.6-1.4 2-2.4 4-2.4 3.6 0 5.5 3.3 4 6.7-2.5 4.7-10 9.3-10 9.3z"/></>} />;

/* ── Animated stat card ── */
function StatCard({ icon: Icon, target, suffix = '', label, color = 'primary' }) {
  const [ref, value] = useCountUp(target);
  const bg  = color === 'secondary' ? 'bg-secondary-light' : 'bg-primary-light';
  const ic  = color === 'secondary' ? 'text-secondary-dark' : 'text-primary-dark';
  const num = color === 'secondary' ? 'text-secondary-dark' : 'text-primary-dark';
  return (
    <div ref={ref} className="card-hover bg-white border border-[#E7E5E0] shadow-fb-card rounded-2xl p-6 text-center group">
      <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110`}>
        <Icon className={`w-6 h-6 ${ic}`} />
      </div>
      <p className={`text-2xl md:text-[28px] font-semibold ${num} count-up tracking-tight leading-tight`}>
        {value.toLocaleString()}{suffix}
      </p>
      <p className="text-[#6B7280] text-sm mt-2.5 font-medium">{label}</p>
    </div>
  );
}

/* ── Testimonials data ── */
const TESTIMONIALS = [
  { name: 'Priya R.', org: 'Asha Foundation', stars: 5, text: 'FoodBridge has transformed how we source food for our community kitchen. We now receive fresh meals daily!' },
  { name: 'Chef Kiran', org: 'Spice Garden Restaurant', stars: 5, text: 'Simple, fast, and meaningful. We donate our surplus every night now and it feels great knowing it helps real people.' },
  { name: 'Rahul M.', org: 'Helping Hands NGO', stars: 5, text: 'The notification system is brilliant. We claim food in minutes and our beneficiaries never go hungry.' },
];

function Home() {
  const [statsRef, statsVisible] = useOnScreen();
  const [howRef,   howVisible]   = useOnScreen();
  const [whyRef,   whyVisible]   = useOnScreen();
  const [audRef,   audVisible]   = useOnScreen();
  const [tesRef,   tesVisible]   = useOnScreen();
  const [ctaRef,   ctaVisible]   = useOnScreen();

  const reveal = (v) =>
    `transition-all duration-700 ease-out ${v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;

  const processSteps = [
    { icon: IconClipboard, num: '01', title: 'Restaurant Posts',   desc: 'Post surplus food in under a minute — food type, quantity, and freshness window.',   color: 'primary' },
    { icon: IconBellRing,  num: '02', title: 'NGOs Get Notified',  desc: 'Nearby NGOs receive instant real-time alerts the moment a listing goes live.',       color: 'secondary' },
    { icon: IconUsers,     num: '03', title: 'Food Reaches People', desc: 'NGOs claim and collect. Surplus food feeds communities instead of filling landfills.', color: 'primary' },
  ];

  const whyCards = [
    { icon: IconShield,  title: 'Fair Distribution',   desc: 'First-come, first-served. No ranking, no bias — every NGO competes equally.', color: 'primary' },
    { icon: IconBolt,    title: 'Real-Time Alerts',    desc: 'Instant notifications ensure food is claimed within minutes of posting.', color: 'secondary' },
    { icon: IconLeaf,    title: 'Zero Food Waste',     desc: 'Good food feeds people, not landfills. Every gram saved matters.', color: 'primary' },
    { icon: IconGift,    title: 'Free for NGOs',       desc: 'FoodBridge is completely free for all registered NGOs. Always.', color: 'secondary' },
    { icon: IconStar,    title: 'Trust & Ratings',     desc: 'Verified restaurants and rated NGOs ensure quality and accountability.', color: 'primary' },
    { icon: IconTruck,   title: 'Easy Pickup Flow',    desc: 'Streamlined claim-to-collect workflow with status tracking.', color: 'secondary' },
  ];

  return (
    <PageTransition>
    <div className="font-sans">

      {/* ──────────── HERO (BRIGHT, CREAM WITH SUBTLE GREEN + SAND GRADIENT) ──────────── */}
      <section id="home" className="relative pt-8 sm:pt-12 md:pt-16 pb-20 sm:pb-24 md:pb-28 px-4 sm:px-6 overflow-hidden" style={{ background: 'linear-gradient(135deg, #F8F6F3 0%, #F4F2EB 40%, #E8F0E8 80%, #F4EDE3 100%)' }}>
        {/* Floating blurred blobs */}
        <div className="blob-float absolute -top-20 -left-20 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-[#7E9B7A]/15 blur-3xl pointer-events-none" />
        <div className="blob-float absolute -bottom-20 -right-20 w-80 sm:w-[480px] h-80 sm:h-[480px] rounded-full bg-[#D9A441]/10 blur-3xl pointer-events-none" style={{ animationDelay: '3s' }} />
        <div className="blob-float absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-[#3E5F48]/10 blur-3xl pointer-events-none" style={{ animationDelay: '6s' }} />

        <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left — copy */}
          <div className="fade-in-up text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-[#3E5F48]/10 border border-[#3E5F48]/20 text-[#3E5F48] text-xs font-bold px-3.5 sm:px-4 py-1.5 rounded-full mb-4 sm:mb-6 uppercase tracking-wider backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3E5F48] animate-pulse" />
              Food Rescue Platform
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-5 leading-[1.15] text-[#1F2D23] tracking-tight">
              Connecting{' '}
              <span className="text-[#3E5F48]">Surplus Food</span>{' '}
              with People Who Need It.
            </h1>

            <p className="text-[#6B7280] text-base sm:text-lg leading-relaxed max-w-md mx-auto md:mx-0 mb-6 sm:mb-8">
              Restaurants donate surplus food. Nearby NGOs receive instant notifications and collect it before it goes to waste. Together we reduce hunger and food waste.
            </p>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-8 sm:mb-10">
              <Link to="/start" className="no-underline w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto hover:scale-105 shadow-sm">
                  Get Started Free →
                </Button>
              </Link>
              <Link to="/restaurant?mode=login" className="no-underline w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto hover:scale-105">
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6">
              {[
                { icon: IconLeaf,  label: 'Less Food Waste' },
                { icon: IconUsers, label: 'Stronger Communities' },
                { icon: IconGlobe, label: 'Greener Tomorrow' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 sm:gap-2.5">
                  <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-[#3E5F48]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#3E5F48]" />
                  </div>
                  <span className="text-[#1F2D23] text-xs sm:text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — illustration */}
          <div className="relative flex justify-center items-center fade-in-up delay-150 py-4 sm:py-8 max-w-full overflow-visible">
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full bg-[#3E5F48]/10 blur-2xl scale-75 pointer-events-none" />

            <img
              src={homeImage}
              alt="Surplus food being shared with communities"
              className="relative w-full max-w-[280px] sm:max-w-sm drop-shadow-xl z-10"
              loading="eager"
            />

            {/* Floating notification card — top left */}
            <div className="absolute top-2 left-0 sm:-left-4 md:-left-8 bg-white/95 backdrop-blur-sm border border-[#E7E5E0] rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-md flex items-center gap-2 sm:gap-3 max-w-[170px] sm:max-w-[200px] z-20 fade-in-up delay-300">
              <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                <IconStore className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-primary-dark" />
              </div>
              <div className="min-w-0">
                <p className="text-ink text-[11px] sm:text-xs font-bold truncate">Restaurant</p>
                <p className="text-ink-soft text-[10px] sm:text-[11px] truncate">posted 20 meals</p>
                <p className="text-ink-soft/60 text-[9px] sm:text-[10px]">2 mins ago</p>
              </div>
            </div>

            {/* Floating card — bottom right */}
            <div className="absolute bottom-2 right-0 sm:-right-4 md:-right-8 bg-white/95 backdrop-blur-sm border border-[#E7E5E0] rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-md flex items-center gap-2 sm:gap-3 max-w-[160px] sm:max-w-[190px] z-20 fade-in-up delay-400">
              <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-secondary-light flex items-center justify-center flex-shrink-0">
                <IconHeart className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-secondary-dark" />
              </div>
              <div className="min-w-0">
                <p className="text-ink text-[11px] sm:text-xs font-bold truncate">NGO Claimed</p>
                <p className="text-ink-soft text-[10px] sm:text-[11px] truncate">50 meals saved</p>
                <p className="text-ink-soft/60 text-[9px] sm:text-[10px]">5 mins ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"
          className="absolute bottom-0 left-0 w-full h-12 md:h-16 pointer-events-none">
          <path d="M0,80 C360,30 720,110 1440,50 L1440,120 L0,120 Z" fill="#F8F6F3" />
        </svg>
      </section>

      {/* ──────────── STATS ──────────── */}
      <section ref={statsRef} className={`bg-fb-gradient py-12 sm:py-16 md:py-20 px-4 sm:px-6 ${reveal(statsVisible)}`}>
        <div className="max-w-5xl mx-auto text-center mb-8 sm:mb-10">
          <p className="text-primary text-xs sm:text-sm font-bold uppercase tracking-widest mb-1.5 sm:mb-2">Our Impact</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink">Numbers that matter</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 max-w-4xl mx-auto">
          <StatCard icon={IconPackage}  target={12500} suffix="+"  label="Meals Saved"        />
          <StatCard icon={IconStore}    target={250}   suffix="+"  label="Restaurants Joined" color="secondary" />
          <StatCard icon={IconUsers}    target={180}   suffix="+"  label="NGOs Connected"     />
          <StatCard icon={IconMapPin}   target={22}    suffix=""   label="Cities Served"      color="secondary" />
        </div>
      </section>

      {/* ──────────── HOW IT WORKS / ABOUT SECTION ──────────── */}
      <section id="about" ref={howRef} className={`bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 ${reveal(howVisible)}`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-primary text-xs sm:text-sm font-bold uppercase tracking-widest mb-1.5 sm:mb-2">How It Works</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink mb-2 sm:mb-3">A simple process. A big impact.</h2>
            <p className="text-ink-soft text-sm sm:text-base max-w-md mx-auto">FoodBridge makes food rescue easy, fast, and transparent — for restaurants and NGOs alike.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-14 left-[33%] right-[33%] h-0.5 bg-gradient-to-r from-primary via-secondary to-primary opacity-30 z-0" />

            {processSteps.map((step, i) => {
              const isPrimary = step.color === 'primary';
              return (
                <div key={step.num} className={`relative card-hover bg-white border border-gray-100 shadow-fb-card rounded-3xl p-6 sm:p-8 text-center group z-10 fade-in-up`}
                  style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="relative inline-flex mb-5 sm:mb-6">
                    <div className={`w-14 sm:w-16 h-14 sm:h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${isPrimary ? 'bg-primary-light' : 'bg-secondary-light'}`}>
                      <step.icon className={`w-6 sm:w-7 h-6 sm:h-7 ${isPrimary ? 'text-primary-dark' : 'text-secondary-dark'}`} />
                    </div>
                    <span className={`absolute -top-2 -right-2 w-6 sm:w-7 h-6 sm:h-7 rounded-full flex items-center justify-center text-white text-xs font-black shadow-sm ${isPrimary ? 'bg-primary' : 'bg-secondary'}`}>
                      {step.num}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-ink mb-2">{step.title}</h3>
                  <p className="text-ink-soft text-sm leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────── WHY FOODBRIDGE ──────────── */}
      <section ref={whyRef} className={`bg-fb-gradient py-12 sm:py-16 md:py-20 px-4 sm:px-6 ${reveal(whyVisible)}`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-primary text-xs sm:text-sm font-bold uppercase tracking-widest mb-1.5 sm:mb-2">Why Choose Us</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink mb-2 sm:mb-3">Small actions, healthier tomorrow.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            {whyCards.map((c, i) => {
              const isPrimary = c.color === 'primary';
              return (
                <div key={c.title} className={`card-hover bg-white border border-gray-100 shadow-fb-card rounded-2xl p-5 sm:p-6 group fade-in-up`}
                  style={{ animationDelay: `${i * 75}ms` }}>
                  <div className={`w-11 sm:w-12 h-11 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110 ${isPrimary ? 'bg-primary-light' : 'bg-secondary-light'}`}>
                    <c.icon className={`w-5 sm:w-5.5 h-5 sm:h-5.5 ${isPrimary ? 'text-primary-dark' : 'text-secondary-dark'}`} />
                  </div>
                  <h3 className="font-extrabold text-ink text-base sm:text-lg mb-1.5">{c.title}</h3>
                  <p className="text-ink-soft text-sm leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────── FOR RESTAURANTS / NGOS ──────────── */}
      <section ref={audRef} className={`bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 ${reveal(audVisible)}`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-primary text-xs sm:text-sm font-bold uppercase tracking-widest mb-1.5 sm:mb-2">Who Is It For?</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink mb-2 sm:mb-3">Built for two sides of the same mission.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Restaurants */}
            <div className="group bg-gradient-to-br from-primary-light/60 via-primary-light/20 to-white border border-primary/20 rounded-3xl p-6 sm:p-8 card-hover flex flex-col justify-between">
              <div>
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-primary flex items-center justify-center mb-4 sm:mb-5 transition-transform duration-300 group-hover:scale-110">
                  <IconStore className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-ink mb-1">For Restaurants</h3>
                <p className="text-primary-dark text-sm font-semibold mb-5 sm:mb-6">Turn your surplus into smiles.</p>
                <ul className="flex flex-col gap-2.5 sm:gap-3 mb-6 sm:mb-8">
                  {['Post surplus food in under a minute','Reduce food waste responsibly','Track your real-world impact','Be part of a larger social cause'].map(item => (
                    <li key={item} className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-ink">
                      <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                        <IconCheck className="w-3 h-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/restaurant?mode=register" className="no-underline w-full sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto hover:scale-105">Join as Restaurant →</Button>
              </Link>
            </div>

            {/* NGOs */}
            <div className="group bg-gradient-to-br from-secondary-light/60 via-secondary-light/20 to-white border border-secondary/20 rounded-3xl p-6 sm:p-8 card-hover flex flex-col justify-between">
              <div>
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-secondary flex items-center justify-center mb-4 sm:mb-5 transition-transform duration-300 group-hover:scale-110">
                  <IconUsers className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-ink mb-1">For NGOs</h3>
                <p className="text-secondary-dark text-sm font-semibold mb-5 sm:mb-6">Get food. Serve communities.</p>
                <ul className="flex flex-col gap-2.5 sm:gap-3 mb-6 sm:mb-8">
                  {['Receive instant nearby food alerts','Claim food on a fair, first-served basis','Serve more people with real meals','Always free — no hidden charges'].map(item => (
                    <li key={item} className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-ink">
                      <span className="w-5 h-5 rounded-full bg-secondary text-white flex items-center justify-center flex-shrink-0">
                        <IconCheck className="w-3 h-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/ngo?mode=register" className="no-underline w-full sm:w-auto">
                <Button variant="secondary" className="w-full sm:w-auto hover:scale-105">Join as NGO →</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────── TESTIMONIALS ──────────── */}
      <section ref={tesRef} className={`bg-fb-gradient py-12 sm:py-16 md:py-20 px-4 sm:px-6 ${reveal(tesVisible)}`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-primary text-xs sm:text-sm font-bold uppercase tracking-widest mb-1.5 sm:mb-2">Testimonials</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink mb-2 sm:mb-3">Loved by restaurants and NGOs alike.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className={`card-hover bg-white border border-gray-100 shadow-fb-card rounded-2xl p-5 sm:p-6 fade-in-up`}
                style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex gap-0.5 mb-3 sm:mb-4">
                  {[...Array(t.stars)].map((_, s) => (
                    <svg key={s} className="w-4 h-4 text-secondary fill-current" viewBox="0 0 20 20">
                      <polygon points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7" />
                    </svg>
                  ))}
                </div>
                <p className="text-ink text-sm leading-relaxed mb-4 sm:mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-primary-light flex items-center justify-center text-primary-dark font-bold text-sm flex-shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-ink text-sm font-semibold">{t.name}</p>
                    <p className="text-ink-soft text-xs">{t.org}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── CLOSING CTA / CONTACT ──────────── */}
      <section id="contact" ref={ctaRef} className={`bg-white pb-16 sm:pb-20 px-4 sm:px-6 pt-4 ${reveal(ctaVisible)}`}>
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-br from-[#3E5F48] via-[#4F6A57] to-[#6A7F63] rounded-3xl px-5 sm:px-8 py-10 sm:py-14 overflow-hidden text-center">
            {/* Blobs */}
            <div className="blob-float absolute -top-12 -right-12 w-56 h-56 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
            <div className="blob-float absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-primary/20 blur-3xl pointer-events-none" style={{ animationDelay: '4s' }} />

            <div className="relative">
              <p className="text-primary-light text-xs font-bold uppercase tracking-widest mb-2.5 sm:mb-3">Be Part of the Change</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 sm:mb-4 max-w-xl mx-auto leading-tight">
                Together we can reduce food waste and feed more people.
              </h2>
              <p className="text-forest-muted text-sm sm:text-base mb-6 sm:mb-8 max-w-md mx-auto">
                Join hundreds of restaurants and NGOs already making a difference in cities across India.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/start/register" className="no-underline w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto hover:scale-105">
                    Join as Restaurant →
                  </Button>
                </Link>
                <Link to="/start/register" className="no-underline w-full sm:w-auto">
                  <Button variant="outline-white" size="lg" className="w-full sm:w-auto hover:scale-105">
                    Join as NGO
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
    </PageTransition>
  );
}

export default Home;