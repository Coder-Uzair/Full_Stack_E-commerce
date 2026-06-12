import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from './Navbar.jsx';
import { Footer } from './Footer.jsx';
import { CartDrawer } from './CartDrawer.jsx';
import { useScrollTop } from '@/hooks/useScrollTop.js';

export function MainLayout() {
  const location = useLocation();
  useScrollTop();

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-ink-950">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
