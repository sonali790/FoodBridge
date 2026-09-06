import { useEffect, useRef, useState } from 'react';
import useOnScreen from './useOnScreen';

// Animates from 0 to `target` over `duration` ms once the returned ref scrolls into view.
function useCountUp(target, duration = 1400) {
  const [ref, isVisible] = useOnScreen();
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!isVisible || startedRef.current) return;
    startedRef.current = true;

    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isVisible, target, duration]);

  return [ref, value];
}

export default useCountUp;
