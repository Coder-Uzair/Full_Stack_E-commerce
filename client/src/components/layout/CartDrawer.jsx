import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext.jsx';
import { Button } from '@/components/common/Button.jsx';
import { formatCurrency } from '@/utils/format.js';
import { ROUTES } from '@/utils/constants.js';

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    subtotal,
    shipping,
    total,
    freeShippingRemaining,
    freeShippingThreshold,
  } = useCart();

  const progress =
    freeShippingRemaining <= 0
      ? 100
      : Math.min(100, ((freeShippingThreshold - freeShippingRemaining) / freeShippingThreshold) * 100);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[90] bg-ink-950/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed right-0 top-0 z-[95] flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-ink-950"
          >
            <div className="flex items-center justify-between border-b border-ink-100 p-5 dark:border-ink-800">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <ShoppingBag size={20} /> Your cart
              </h2>
              <button
                onClick={closeDrawer}
                className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-ink-100 dark:bg-ink-800">
                  <ShoppingBag size={28} className="text-ink-400" />
                </div>
                <div>
                  <p className="font-semibold">Your cart is empty</p>
                  <p className="mt-1 text-sm text-ink-500">
                    Find something you love.
                  </p>
                </div>
                <Button onClick={closeDrawer} variant="primary">
                  <Link to={ROUTES.SHOP}>Start shopping</Link>
                </Button>
              </div>
            ) : (
              <>
                {/* Free shipping progress */}
                <div className="border-b border-ink-100 px-5 py-4 dark:border-ink-800">
                  <p className="mb-2 text-xs text-ink-500">
                    {freeShippingRemaining > 0 ? (
                      <>
                        Add{' '}
                        <span className="font-semibold text-brand-600">
                          {formatCurrency(freeShippingRemaining)}
                        </span>{' '}
                        for free shipping
                      </>
                    ) : (
                      <span className="font-semibold text-emerald-600">
                        🎉 You’ve unlocked free shipping!
                      </span>
                    )}
                  </p>
                  <div className="h-1.5 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
                    <motion.div
                      className="h-full rounded-full bg-brand-gradient"
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="flex-1 space-y-4 overflow-y-auto p-5">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.productId}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, x: 40 }}
                        className="flex gap-3"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-20 w-20 rounded-xl object-cover"
                        />
                        <div className="flex flex-1 flex-col">
                          <p className="line-clamp-1 text-sm font-semibold">{item.name}</p>
                          <p className="text-sm text-ink-500">
                            {formatCurrency(item.price)}
                          </p>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center rounded-lg border border-ink-200 dark:border-ink-700">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="grid h-8 w-8 place-items-center text-ink-500 hover:text-ink-900 dark:hover:text-white"
                                aria-label="Decrease"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center text-sm font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="grid h-8 w-8 place-items-center text-ink-500 hover:text-ink-900 dark:hover:text-white"
                                aria-label="Increase"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="text-ink-400 hover:text-red-500"
                              aria-label="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Summary */}
                <div className="space-y-3 border-t border-ink-100 p-5 dark:border-ink-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-500">Subtotal</span>
                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-500">Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-ink-100 pt-3 text-base font-bold dark:border-ink-800">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <Link to={ROUTES.CHECKOUT} onClick={closeDrawer}>
                    <Button variant="primary" size="lg" className="w-full">
                      Checkout
                    </Button>
                  </Link>
                  <Link to={ROUTES.CART} onClick={closeDrawer}>
                    <Button variant="ghost" className="w-full">
                      View full cart
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartDrawer;
