// Wrap a page's root element with this to get a consistent fade/slide-in on route change.
// Usage: <PageTransition><div>...page content...</div></PageTransition>
function PageTransition({ children, className = '' }) {
  return <div className={`page-transition ${className}`}>{children}</div>;
}

export default PageTransition;
