import Spinner from './Spinner';

const VARIANTS = {
  primary: 'bg-primary hover:bg-primary-dark text-white glow-green shadow-sm',
  secondary: 'bg-secondary hover:bg-secondary-dark text-white glow-amber shadow-sm',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  ghost: 'text-ink-soft hover:text-ink hover:bg-gray-100',
  danger: 'bg-danger-light text-danger hover:bg-danger hover:text-white border border-danger/20',
  'outline-white': 'border-2 border-white/60 text-white hover:bg-white/10',
};

/**
 * Premium reusable Button with:
 * - btn-shine sweep effect
 * - Click ripple
 * - Loading spinner (light for solid variants)
 * - Rounded full by default
 * - Multiple variants: primary | secondary | outline | ghost | danger | outline-white
 */
function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  size = 'md',
  ...rest
}) {
  const sizeClass = {
    sm:  'px-4 py-1.5 text-xs',
    md:  'px-6 py-2.5 text-sm',
    lg:  'px-8 py-3.5 text-base',
  }[size] || 'px-6 py-2.5 text-sm';

  const isLight = ['outline', 'ghost', 'danger', 'outline-white'].includes(variant);

  const handleClick = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top  = `${e.clientY - rect.top  - size / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 550);
    if (onClick) onClick(e);
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      className={`btn-shine relative overflow-hidden inline-flex items-center justify-center gap-2 ${sizeClass} rounded-full font-semibold transition-all duration-200 active:scale-95 disabled:opacity-55 disabled:cursor-not-allowed ${VARIANTS[variant] || VARIANTS.primary} ${className}`}
      {...rest}
    >
      {loading && <Spinner size={15} light={!isLight} />}
      {children}
    </button>
  );
}

export default Button;
