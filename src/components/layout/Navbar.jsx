import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/Icon';
import { SITE } from '@/config/site';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/orders', label: 'Orders' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { count } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const transparent = pathname === '/' && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const linkCls = ({ isActive }) =>
    `relative text-xs font-semibold uppercase tracking-widest transition-colors hover:text-accent ${
      isActive ? 'text-accent' : ''
    }`;

  return (
    <>
      <div className="bg-primary py-2 text-center text-[11px] font-medium uppercase tracking-widest text-white">
        {SITE.shipping} &middot; Call / WhatsApp{' '}
        <a href={`tel:${SITE.phone}`} className="text-accent hover:underline">
          {SITE.phone}
        </a>
      </div>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          transparent ? 'bg-transparent text-white' : 'bg-white/95 text-primary shadow-sm backdrop-blur'
        } ${pathname === '/' ? '-mb-[72px]' : ''}`}
      >
        <nav className="container-x flex h-[72px] items-center justify-between">
          <Link to="/" className="flex flex-col leading-none">
            <span className="font-display text-xl font-bold tracking-wide sm:text-2xl">
              Choubey Ji<span className="text-accent">.</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest2 opacity-70">Mens Wear</span>
          </Link>

          <ul className="hidden items-center gap-10 md:flex">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.to === '/'} className={linkCls}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="hidden items-center gap-3 md:flex">
                <span className="text-xs uppercase tracking-wider opacity-80">Hi, {user.name}</span>
                {user.role === 'ROLE_ADMIN' && (
                  <Link to="/admin" className="text-xs font-semibold uppercase tracking-wider text-accent hover:underline">
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="text-xs font-semibold uppercase tracking-wider hover:text-accent"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden hover:text-accent md:block" aria-label="Login">
                <Icon name="user" />
              </Link>
            )}
            <Link to="/cart" className="relative hover:text-accent" aria-label="Cart">
              <Icon name="cart" className="h-6 w-6" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
              <Icon name={open ? 'close' : 'menu'} className="h-6 w-6" />
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t bg-white text-primary md:hidden"
            >
              <ul className="container-x flex flex-col gap-5 py-6">
                {LINKS.map((l) => (
                  <li key={l.to}>
                    <NavLink to={l.to} end={l.to === '/'} className={linkCls}>
                      {l.label}
                    </NavLink>
                  </li>
                ))}
                {user?.role === 'ROLE_ADMIN' && (
                  <li>
                    <NavLink to="/admin" className={linkCls}>
                      Admin Dashboard
                    </NavLink>
                  </li>
                )}
                <li>
                  {isAuthenticated ? (
                    <button onClick={logout} className="text-xs font-semibold uppercase tracking-widest">
                      Logout ({user.name})
                    </button>
                  ) : (
                    <NavLink to="/login" className={linkCls}>
                      Login / Signup
                    </NavLink>
                  )}
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
