import { useState, useEffect } from 'react';

/** Returns a debounced copy of `value` after `delay` ms (default 300). */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default useDebounce;
