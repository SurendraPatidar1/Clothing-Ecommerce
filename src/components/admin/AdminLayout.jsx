import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/Icon';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/admin/products', label: 'Products', icon: 'box' },
  { to: '/admin/categories', label: 'Categories', icon: 'folder' },
  { to: '/admin/orders', label: 'Orders', icon: 'clipboard' },
  { to: '/admin/users', label: 'Users', icon: 'users' },
];

function SidebarContent({ onLogout }) {
  const linkCls = ({ isActive }) =>
    `group relative flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors ${
      isActive ? 'text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex flex-col px-6 py-6 leading-none">
        <span className="font-display text-xl font-bold text-white">
          Choubey Ji<span className="text-accent">.</span>
        </span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-widest2 text-gray-500">Admin Panel</span>
      </Link>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={linkCls}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="admin-nav-active"
                    className="absolute inset-0 rounded-md bg-accent"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <Icon name={item.icon} className="relative h-5 w-5" />
                <span className="relative">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <Icon name="logout" className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const current = NAV.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to)));

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-primary lg:block">
        <SidebarContent onLogout={handleLogout} />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-primary lg:hidden"
            >
              <SidebarContent onLogout={handleLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Icon name="menu" className="h-6 w-6" />
            </button>
            <h1 className="font-display text-lg font-semibold sm:text-xl">{current?.label ?? 'Admin'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-500 sm:inline">{user?.email}</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
