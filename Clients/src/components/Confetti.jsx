import { useMemo } from 'react';

const COLORS = ['#3E5F48', '#D9A441', '#4F6A57', '#7E9B7A', '#F4EDE3'];

// Renders a short-lived confetti burst. Mount it conditionally (e.g. `{show && <Confetti />}`)
// and unmount after ~1.5s (the parent controls timing via a timeout).
function Confetti({ pieceCount = 40 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: pieceCount }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.3,
        color: COLORS[i % COLORS.length],
        rotate: Math.random() * 360,
        size: 6 + Math.random() * 6,
      })),
    [pieceCount]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.4,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default Confetti;
