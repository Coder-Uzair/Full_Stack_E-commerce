import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram } from 'lucide-react';

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'All products', to: '/shop' },
      { label: 'Instruments', to: '/shop?category=musical-instruments' },
      { label: 'Footwear', to: '/shop?category=premium-footwear' },
      { label: 'Carry & Bags', to: '/shop?category=carry-bags' },
      { label: 'Space Collection', to: '/shop?category=space-collection' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign in', to: '/login' },
      { label: 'Create account', to: '/register' },
      { label: 'Orders', to: '/account/orders' },
      { label: 'Wishlist', to: '/wishlist' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/shop' },
      { label: 'Sustainability', to: '/shop' },
      { label: 'Careers', to: '/shop' },
      { label: 'Contact', to: '/shop' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-ink-50/50 dark:border-ink-800 dark:bg-ink-950">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 font-display">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient text-sm font-extrabold text-white">
                A
              </span>
              <span className="text-lg font-extrabold tracking-tight">Aurora</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-ink-500 dark:text-ink-400">
              Considered commerce for instruments, footwear, carry goods, and the
              cosmically curious. Built to last.
            </p>
            <div className="mt-5 flex gap-2">
              {[Twitter, Instagram, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-ink-200 text-ink-500 transition hover:border-brand-400 hover:text-brand-600 dark:border-ink-700"
                  aria-label="Social link"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-ink-900 dark:text-white">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-ink-500 transition hover:text-brand-600 dark:text-ink-400 dark:hover:text-brand-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink-100 pt-6 text-sm text-ink-400 dark:border-ink-800 sm:flex-row">
          <p>© {new Date().getFullYear()} Aurora. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-ink-700 dark:hover:text-ink-200">Privacy</a>
            <a href="#" className="hover:text-ink-700 dark:hover:text-ink-200">Terms</a>
            <a href="#" className="hover:text-ink-700 dark:hover:text-ink-200">Shipping</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
