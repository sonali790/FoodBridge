// A larger inline-SVG hero illustration: a wooden crate of vegetables
// with a heart cut into the front panel, and a soft glow behind it.
function HeroIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 360 320" className={className} fill="none">
      {/* glow */}
      <ellipse cx="180" cy="200" rx="150" ry="110" fill="#3E5F48" opacity="0.18" />
      <ellipse cx="230" cy="140" rx="90" ry="70" fill="#D9A441" opacity="0.15" />

      {/* ground shadow */}
      <ellipse cx="180" cy="290" rx="120" ry="14" fill="#000000" opacity="0.12" />

      {/* crate body */}
      <rect x="60" y="170" width="240" height="110" rx="10" fill="#3E5F48" />
      <rect x="60" y="170" width="240" height="30" rx="10" fill="#2D4535" />
      {/* crate slats */}
      <path d="M60 210h240M60 240h240" stroke="#1F2D23" strokeWidth="3" opacity="0.5" />
      <path d="M105 200v80M150 200v80M210 200v80M255 200v80" stroke="#1F2D23" strokeWidth="3" opacity="0.4" />

      {/* heart cutout on crate front */}
      <path
        d="M180 260c-16-10-27-19-27-31a14.5 14.5 0 0 1 27-8 14.5 14.5 0 0 1 27 8c0 12-11 21-27 31z"
        fill="#F8F6F3"
      />

      {/* crate flaps open */}
      <path d="M75 170 L110 120 H160 L180 170 Z" fill="#4F6A57" />
      <path d="M180 170 L200 120 H250 L285 170 Z" fill="#3E5F48" />

      {/* vegetables poking out */}
      <path d="M150 175c-6-40 4-65 22-78-2 30-6 55-8 78z" fill="#D9A441" />
      <path d="M150 175c-4-38-16-58-34-66 8 26 18 48 22 66z" fill="#E6BE70" />
      <path d="M185 172c2-42-6-66-20-82 8 30 12 58 8 82z" fill="#3E5F48" />
      <path d="M200 175c8-36 24-52 42-58-14 22-26 42-30 58z" fill="#7E9B7A" />
      <path d="M225 178c10-30 26-44 44-46-16 18-30 32-34 46z" fill="#4F6A57" />

      {/* leafy tops */}
      <path d="M140 100c8-6 18-6 24 2-8 2-16 4-24-2z" fill="#7E9B7A" />
      <path d="M240 92c8-8 18-10 26-4-8 4-18 8-26 4z" fill="#3E5F48" />
    </svg>
  );
}

export default HeroIllustration;
