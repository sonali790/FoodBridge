import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(null);

function ToastIcon({ type }) {
  if (type === 'success') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  if (type === 'error') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="13" /><circle cx="12" cy="16.3" r="0.3" fill="currentColor" />
    </svg>
  );
}

const STYLES = {
  success: 'bg-white border-l-4 border-primary text-ink',
  error: 'bg-white border-l-4 border-red-500 text-ink',
  info: 'bg-white border-l-4 border-secondary text-ink',
};

const ICON_BG = {
  success: 'bg-primary-light text-primary-dark',
  error: 'bg-red-100 text-red-600',
  info: 'bg-secondary-light text-secondary-dark',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = ++idRef.current;
    setToasts((current) => [...current, { id, message, type }]);
    if (duration) {
      setTimeout(() => dismiss(id), duration);
    }
    return id;
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 w-[90vw] max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast-in shadow-lg rounded-lg px-4 py-3 flex items-start gap-3 ${STYLES[t.type] || STYLES.info}`}
          >
            <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${ICON_BG[t.type] || ICON_BG.info}`}>
              <ToastIcon type={t.type} />
            </span>
            <p className="text-sm leading-snug pt-0.5 flex-1">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none px-1"
              aria-label="Dismiss"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
