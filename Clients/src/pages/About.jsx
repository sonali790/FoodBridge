import PageTransition from '../components/PageTransition';
import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    emoji: '🍽️',
    t: 'The Problem',
    d: "Restaurants discard large quantities of surplus food every night, while nearby NGOs struggle to feed communities in need. There's no smart, real-time bridge connecting the two — until now.",
  },
  {
    emoji: '🌉',
    t: 'Our Solution',
    d: 'FoodBridge is a real-time platform where restaurants post surplus food listings in seconds, and NGOs get instantly notified and can claim food on a fair, first-come-first-served basis.',
  },
  {
    emoji: '💚',
    t: 'Why It Matters',
    d: 'Every meal saved is a meal that reaches someone who needs it, instead of going to waste. FoodBridge makes that connection fast, fair, and transparent for everyone involved.',
  },
  {
    emoji: '⚖️',
    t: 'Our Approach',
    d: 'No ranking, no bias — every NGO competes equally for every listing. Restaurants get a dead-simple, click-based way to post surplus food even during a busy closing shift.',
  },
];

const VALUES = [
  { emoji: '🤝', title: 'Community First',      desc: 'We believe strong communities are built on trust, fairness, and shared purpose.' },
  { emoji: '🌿', title: 'Zero Waste Mission',   desc: 'Every gram of food we rescue is a step toward a more sustainable world.' },
  { emoji: '⚡', title: 'Technology for Good',  desc: 'We use real-time tech to create real-world impact — fast and reliably.' },
  { emoji: '🔒', title: 'Transparency & Trust', desc: 'Verified users, honest ratings, and clear logs ensure everyone is accountable.' },
];

function About() {
  return (
    <PageTransition>
      <div className="font-sans">
        {/* Hero (matches Home page bright cream/sand theme) */}
        <section className="relative text-center py-12 sm:py-16 px-4 sm:px-6 overflow-hidden" style={{ background: 'linear-gradient(135deg, #F8F6F3 0%, #F4F2EB 40%, #E8F0E8 80%, #F4EDE3 100%)' }}>
          <div className="blob-float absolute -top-16 -left-10 w-64 h-64 rounded-full bg-[#7E9B7A]/15 blur-3xl pointer-events-none" />
          <div className="blob-float absolute -bottom-16 -right-10 w-64 h-64 rounded-full bg-[#D9A441]/10 blur-3xl pointer-events-none" style={{ animationDelay: '4s' }} />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-[#3E5F48]/10 border border-[#3E5F48]/20 text-[#3E5F48] text-xs font-bold px-3.5 sm:px-4 py-1.5 rounded-full mb-3 sm:mb-4 uppercase tracking-wider backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3E5F48] animate-pulse" />
              Our Story
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#1F2D23] mb-2 sm:mb-3 tracking-tight">About FoodBridge</h1>
            <p className="text-[#6B7280] text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              Reducing food waste, one listing at a time — connecting restaurants with the communities who need it most.
            </p>
          </div>
          {/* Wave divider */}
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"
            className="absolute bottom-0 left-0 w-full h-8 sm:h-10 md:h-12 pointer-events-none">
            <path d="M0,80 C360,30 720,110 1440,50 L1440,120 L0,120 Z" fill="#F8F6F3" />
          </svg>
        </section>

        {/* Story sections */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-10 sm:mb-16">
            {SECTIONS.map((s, i) => (
              <div
                key={s.t}
                className={`card-hover bg-white border border-[#E7E5E0] shadow-fb-card rounded-[20px] p-5 sm:p-6 fade-in-up`}
                style={{ animationDelay: `${i * 75}ms` }}
              >
                <span className="text-2xl sm:text-3xl mb-2.5 sm:mb-3 block">{s.emoji}</span>
                <h2 className="text-base sm:text-lg font-extrabold text-[#1F2D23] mb-1.5 sm:mb-2">{s.t}</h2>
                <p className="text-[#6B7280] text-xs sm:text-sm leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>

          {/* Mission statement (Warm Beige -> Light Olive -> Cream continuous banner) */}
          <div
            className="relative border border-[#E7E5E0] rounded-3xl px-6 sm:px-8 py-8 sm:py-12 text-center overflow-hidden mb-10 sm:mb-16 shadow-xs"
            style={{ background: 'linear-gradient(135deg, #E8DDD9 0%, #F4F2EB 50%, #DCD7C3 100%)' }}
          >
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-[#7E9B7A]/15 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-[#D9A441]/10 blur-2xl pointer-events-none" />
            <div className="relative">
              <p className="text-xl sm:text-2xl md:text-3xl font-black text-[#1F2D23] mb-2 sm:mb-3 leading-tight max-w-lg mx-auto">
                "No meal should go to waste while someone goes hungry."
              </p>
              <p className="text-[#6B7280] text-xs sm:text-sm font-semibold">— The FoodBridge Team</p>
            </div>
          </div>

          {/* Values */}
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1F2D23] text-center mb-6 sm:mb-8">Our Core Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {VALUES.map((v, i) => (
                <div key={v.title} className={`card-hover bg-white border border-[#E7E5E0] shadow-fb-card rounded-[20px] p-5 sm:p-6 flex gap-3 sm:gap-4 items-start fade-in-up`}
                  style={{ animationDelay: `${i * 75}ms` }}>
                  <span className="text-2xl sm:text-3xl flex-shrink-0">{v.emoji}</span>
                  <div>
                    <h3 className="font-extrabold text-[#1F2D23] text-sm sm:text-base mb-1">{v.title}</h3>
                    <p className="text-[#6B7280] text-xs sm:text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white pb-12 sm:pb-16 px-4 sm:px-6">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1F2D23] mb-2 sm:mb-3">Ready to make a difference?</h2>
            <p className="text-[#6B7280] text-xs sm:text-sm mb-5 sm:mb-6">Join restaurants and NGOs already bridging food from surplus to purpose.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/start" className="no-underline w-full sm:w-auto text-center bg-gradient-to-r from-[#4A7C59] to-[#3E5F48] hover:opacity-95 text-white px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-105 shadow-sm">
                Get Started →
              </Link>
              <Link to="/contact" className="no-underline w-full sm:w-auto text-center border-2 border-[#3E5F48] text-[#3E5F48] px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 hover:bg-[#3E5F48] hover:text-white">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

export default About;
