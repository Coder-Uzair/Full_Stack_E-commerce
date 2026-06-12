import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { effectivePrice } from '@/utils/format.js';

const CartContext = createContext(null);
const STORAGE_KEY = 'aurora-cart';
const FREE_SHIPPING_THRESHOLD = 150;
const FLAT_SHIPPING = 12;

/**
 * Guest-friendly cart with localStorage persistence and optimistic updates.
 * On login, this local cart is merged server-side (wired in a later milestone).
 * Items store a price snapshot so totals are stable.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const id = product._id || product.id;
      const existing = prev.find((i) => i.productId === id);
      if (existing) {
        return prev.map((i) =>
          i.productId === id
            ? { ...i, quantity: Math.min(99, i.quantity + quantity) }
            : i,
        );
      }
      return [
        ...prev,
        {
          productId: id,
          name: product.name,
          slug: product.slug,
          image: product.images?.[0]?.url || '',
          price: effectivePrice(product),
          stock: product.stock,
          quantity,
        },
      ];
    });
    setDrawerOpen(true);
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.max(1, Math.min(99, quantity)) }
          : i,
      ),
    );
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const shipping =
      subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
    return {
      subtotal,
      count,
      shipping,
      total: subtotal + shipping,
      freeShippingRemaining: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      ...totals,
      isDrawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, totals, isDrawerOpen, addItem, updateQuantity, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export default CartContext;
