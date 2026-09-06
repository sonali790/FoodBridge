// size in px; pass light=true for a white spinner (for use on colored buttons)
function Spinner({ size = 18, className = '', light = false }) {
  return (
    <span
      className={`spinner inline-block ${light ? 'spinner-light' : ''} ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}

export default Spinner;
