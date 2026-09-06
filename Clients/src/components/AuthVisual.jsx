// A simple, friendly SVG scene: a food box with a heart, used as decoration
// alongside auth forms. Pure inline SVG, no external assets.
function FoodDonationIllustration() {
  return (
    <svg viewBox="0 0 220 200" className="w-36 h-32 md:w-40 md:h-36" fill="none">
      {/* ground shadow */}
      <ellipse cx="110" cy="178" rx="70" ry="10" fill="#000000" opacity="0.12" />
      {/* box */}
      <rect x="45" y="90" width="130" height="80" rx="10" fill="#D9A441" />
      <rect x="45" y="90" width="130" height="26" rx="10" fill="#B8872E" />
      <path d="M45 100h130" stroke="#9A7026" strokeWidth="2" opacity="0.4" />
      {/* box flaps */}
      <path d="M60 90 L90 55 H130 L160 90 Z" fill="#E6BE70" />
      <path d="M90 55 L110 90 L130 55" stroke="#B8872E" strokeWidth="2" fill="none" />
      {/* heart on box */}
      <path
        d="M110 148c-14-9-24-17-24-28a13 13 0 0 1 24-8 13 13 0 0 1 24 8c0 11-10 19-24 28z"
        fill="#ffffff"
      />
      {/* leaves */}
      <path d="M35 130c10-14 24-18 34-14-2 12-14 22-34 14z" fill="#4F6A57" />
      <path d="M185 120c-8-12-20-16-30-12 2 11 12 20 30 12z" fill="#6A7F63" />
    </svg>
  );
}

// role: used only to vary the title/subtitle text
const COPY = {
  restaurant: { title: 'Share your surplus', subtitle: 'Every extra plate can reach someone who needs it. Join as a restaurant partner.' },
  ngo: { title: 'Feed your community', subtitle: 'Get notified the moment surplus food is posted nearby, and claim it in seconds.' },
  reset: { title: 'No worries, we\u2019ve got your back! 😊', subtitle: 'We\u2019ll help you get back into your account in just a couple of steps.' },
};

function AuthVisual({ role = 'restaurant' }) {
  const copy = COPY[role] || COPY.restaurant;

  return (
    <div
      className="relative hidden md:flex flex-col justify-center items-center text-center p-6 md:p-8 overflow-hidden h-full border-b md:border-b-0 md:border-r border-[#E7E5E0]"
      style={{ background: 'linear-gradient(135deg, #F4EDE3 0%, #FAF9F6 50%, #E8F0E8 100%)' }}
    >
      {/* glow blobs */}
      <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-[#7E9B7A]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-10 w-52 h-52 rounded-full bg-[#D9A441]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 fade-in-up">
        <FoodDonationIllustration />
        <h2 className="text-[#1F2D23] text-lg font-extrabold mt-3 mb-1.5 leading-snug">{copy.title}</h2>
        <p className="text-[#6B7280] text-xs max-w-[210px] mx-auto leading-relaxed">{copy.subtitle}</p>
      </div>
    </div>
  );
}

export default AuthVisual;
