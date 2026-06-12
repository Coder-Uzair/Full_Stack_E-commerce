import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand side */}
      <div className="relative hidden overflow-hidden bg-brand-gradient lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(600px_400px_at_30%_20%,rgba(255,255,255,0.25),transparent)]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-2 font-display">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/20 text-lg font-extrabold backdrop-blur">
              A
            </span>
            <span className="text-xl font-extrabold">Aurora</span>
          </Link>
          <div>
            <h2 className="font-display text-4xl font-extrabold leading-tight">
              Things worth keeping.
            </h2>
            <p className="mt-4 max-w-sm text-white/80">
              Instruments, footwear, carry goods, and a curated space collection —
              chosen for craft, built to last.
            </p>
          </div>
          <p className="text-sm text-white/60">© {new Date().getFullYear()} Aurora</p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="mb-8 flex items-center gap-2 font-display lg:hidden">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient text-sm font-extrabold text-white">
              A
            </span>
            <span className="text-lg font-extrabold">Aurora</span>
          </Link>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-ink-500">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}

export default AuthShell;
