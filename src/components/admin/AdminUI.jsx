import { motion } from 'framer-motion';

export function Panel({ title, action, children, className = '' }) {
  return (
    <section className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
          {title && <h2 className="font-display text-lg font-semibold">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-accent" />
    </div>
  );
}

export function Message({ children, tone = 'muted' }) {
  return (
    <p className={`px-5 py-12 text-center text-sm ${tone === 'error' ? 'text-red-600' : 'text-gray-500'}`}>{children}</p>
  );
}

export function StatCard({ label, value, icon, color, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${color}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
        <p className="mt-1 truncate text-2xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
}

export const rowMotion = (i) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: Math.min(i, 10) * 0.03 },
});
