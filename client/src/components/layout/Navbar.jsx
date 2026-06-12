import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  User,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext.jsx';
import { useCart } from '@/context/CartContext.jsx';
import { useAuth } from '@/context/AuthContext.jsx';
import { useWishlist } from '@/hooks/useWishlist.js';
import { ROUTES } from '@/utils/constants.js';
import { cn } from '@/utils/cn.js';

const NAV_LINKS = [
  { to: '/shop', label: 'Shop' },
  { to: '/shop?category=musical-instruments', label: 'Instruments' },
  { to: '/shop?category=premium-footwear', label: 'Footwear' },
  { to: '/shop?category=carry-bags', label: 'Carry' },
  { to: '/shop?category=space-collection', label: 'Space' },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { count, openDrawer } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { count: wishCount } = useWishlist();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');

  const onSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100/80 bg-white/80 backdrop-blur-xl dark:border-ink-800/80 dark:bg-ink-950/80">
      <nav className="container-page flex h-16 items-center gap-4">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2 font-display">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient text-sm font-extrabold text-white">
            A
          </span>
          <span className="text-lg font-extrabold tracking-tight text-ink-900 dark:text-white">
            Aurora
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Search (desktop) */}
        <form
          onSubmit={onSearch}
          className="ml-auto hidden max-w-xs flex-1 items-center md:flex"
        >
          <div className="relative w-full">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="h-10 w-full rounded-xl border border-ink-200 bg-ink-50 pl-9 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-ink-700 dark:bg-ink-900"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <IconButton onClick={toggleTheme} label="Toggle theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </IconButton>

          <Link to={ROUTES.WISHLIST}>
            <IconButton label="Wishlist" badge={wishCount}>
              <Heart size={20} />
            </IconButton>
          </Link>

          <IconButton onClick={openDrawer} label="Cart" badge={count}>
            <ShoppingBag size={20} />
          </IconButton>

          {/* Account */}
          <div className="relative hidden md:block">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="grid h-10 w-10 place-items-center rounded-full bg-brand-gradient text-sm font-bold text-white"
                  aria-label="Account menu"
                >
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-ink-100 bg-white p-1.5 shadow-card dark:border-ink-800 dark:bg-ink-900"
                      onMouseLeave={() => setMenuOpen(false)}
                    >
                      <MenuLink to={ROUTES.ACCOUNT} icon={User} onClick={() => setMenuOpen(false)}>
                        My account
                      </MenuLink>
                      <MenuLink to={ROUTES.ACCOUNT_ORDERS} icon={ShoppingBag} onClick={() => setMenuOpen(false)}>
                        Orders
                      </MenuLink>
                      {isAdmin && (
                        <MenuLink to={ROUTES.ADMIN} icon={LayoutDashboard} onClick={() => setMenuOpen(false)}>
                          Admin dashboard
                        </MenuLink>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        <LogOut size={16} /> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="rounded-xl bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800 dark:bg-white dark:text-ink-900 dark:hover:bg-ink-100"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <IconButton
            onClick={() => setMobileOpen((o) => !o)}
            label="Menu"
            className="lg:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </IconButton>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-ink-100 lg:hidden dark:border-ink-800"
          >
            <div className="container-page space-y-1 py-4">
              <form onSubmit={onSearch} className="mb-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products…"
                    className="h-11 w-full rounded-xl border border-ink-200 bg-ink-50 pl-9 pr-3 text-sm outline-none dark:border-ink-700 dark:bg-ink-900"
                  />
                </div>
              </form>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-900"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-ink-100 pt-2 dark:border-ink-800">
                {isAuthenticated ? (
                  <>
                    <Link to={ROUTES.ACCOUNT} onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium">
                      My account
                    </Link>
                    {isAdmin && (
                      <Link to={ROUTES.ADMIN} onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium">
                        Admin dashboard
                      </Link>
                    )}
                    <button onClick={() => { logout(); setMobileOpen(false); }} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600">
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link to={ROUTES.LOGIN} onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-brand-600">
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function IconButton({ children, label, badge, className, ...props }) {
  return (
    <button
      aria-label={label}
      className={cn(
        'relative grid h-10 w-10 place-items-center rounded-xl text-ink-600 transition hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800',
        className,
      )}
      {...props}
    >
      {children}
      {badge > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
}

function MenuLink({ to, icon: Icon, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-800"
    >
      <Icon size={16} /> {children}
    </Link>
  );
}

export default Navbar;
