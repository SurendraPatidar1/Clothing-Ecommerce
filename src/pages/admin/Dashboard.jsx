import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAsync } from '@/hooks/useAsync';
import { adminService } from '@/services/adminService';
import { getErrorMessage } from '@/services/api';
import { formatDate, formatPrice } from '@/utils/helpers';
import { toStatusLabel } from '@/utils/orderStatus';
import Icon from '@/components/ui/Icon';
import StatusBadge from '@/components/orders/StatusBadge';
import { Message, Panel, Spinner, StatCard, rowMotion } from '@/components/admin/AdminUI';

const STATUSES = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const BAR_COLORS = {
  PLACED: 'bg-gray-400',
  PROCESSING: 'bg-amber-500',
  SHIPPED: 'bg-blue-500',
  DELIVERED: 'bg-green-500',
  CANCELLED: 'bg-red-400',
};

export default function Dashboard() {
  const summary = useAsync(() => adminService.getDashboard(), []);
  const recent = useAsync(() => adminService.getOrders({ size: 5 }), []);

  if (summary.loading) return <Spinner />;
  if (summary.error) return <Message tone="error">{getErrorMessage(summary.error)}</Message>;

  const s = summary.data;
  const cards = [
    { label: 'Total Orders', value: s.totalOrders, icon: 'clipboard', color: 'bg-blue-100 text-blue-700' },
    { label: 'Total Products', value: s.activeProducts, icon: 'box', color: 'bg-amber-100 text-amber-700' },
    { label: 'Total Users', value: s.totalUsers, icon: 'users', color: 'bg-purple-100 text-purple-700' },
    { label: 'Revenue', value: formatPrice(s.totalRevenue ?? 0), icon: 'currency', color: 'bg-green-100 text-green-700' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c, i) => (
          <StatCard key={c.label} index={i} {...c} icon={<Icon name={c.icon} className="h-6 w-6" />} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel title="Orders by Status">
          <div className="space-y-4 p-5">
            {STATUSES.map((st, i) => {
              const count = s.ordersByStatus?.[st] ?? 0;
              const pct = s.totalOrders ? (count / s.totalOrders) * 100 : 0;
              return (
                <div key={st}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{toStatusLabel(st)}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <motion.div
                      className={`h-full rounded-full ${BAR_COLORS[st]}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.2 + i * 0.08, duration: 0.6 }}
                    />
                  </div>
                </div>
              );
            })}
            {s.lowStockProducts > 0 && (
              <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
                {s.lowStockProducts} product{s.lowStockProducts > 1 ? 's are' : ' is'} running low on stock.
              </p>
            )}
          </div>
        </Panel>

        <Panel
          title="Recent Orders"
          className="xl:col-span-2"
          action={
            <Link to="/admin/orders" className="text-xs font-semibold uppercase tracking-wider text-accent hover:underline">
              View all
            </Link>
          }
        >
          {recent.loading ? (
            <Spinner />
          ) : recent.error ? (
            <Message tone="error">{getErrorMessage(recent.error)}</Message>
          ) : recent.data.content.length === 0 ? (
            <Message>No orders yet.</Message>
          ) : (
            <ul className="divide-y">
              {recent.data.content.map((o, i) => (
                <motion.li key={o.id} {...rowMotion(i)} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
                  <div className="min-w-0">
                    <p className="font-semibold">{o.orderNumber}</p>
                    <p className="truncate text-xs text-gray-500">
                      {o.customerName} &middot; {formatDate(o.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{formatPrice(o.totalAmount)}</span>
                    <StatusBadge status={o.status} />
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
