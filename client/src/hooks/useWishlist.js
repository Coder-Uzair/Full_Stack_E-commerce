import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'aurora-wishlist';

/**
 * Lightweight wishlist with optimistic localStorage persistence.
 * Server sync for authenticated users is layered on in a later milestone.
 */
export function useWishlist() {
  const [ids, setIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  const has = useCallback((id) => ids.includes(id), [ids]);

  const toggle = useCallback((id) => {
    setIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const remove = useCallback(
    (id) => setIds((prev) => prev.filter((x) => x !== id)),
    [],
  );

  return { ids, has, toggle, remove, count: ids.length };
}

export default useWishlist;
