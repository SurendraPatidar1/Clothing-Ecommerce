import { Fragment, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAsync } from '@/hooks/useAsync';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/adminService';
import { getErrorMessage } from '@/services/api';
import { formatDate, formatPrice } from '@/utils/helpers';
import { ORDER_PROGRESS, toStatusLabel } from '@/utils/orderStatus';
import Pagination from '@/components/ui/Pagination';
import StatusBadge from '@/components/orders/StatusBadge';
import Toast from '@/components/ui/Toast';
import { Message, Panel, Spinner, rowMotion } from '@/components/admin/AdminUI';

// Mirrors the backend's allowed transitions.
const NEXT = {
  PLACED: ['PROCESSING'],
  PROCESSING: ['SHIPPED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

const FILTERS = ['', ...ORDER_PROGRESS, 'CANCELLED'];

function StatusSelect({ order, onChange, busy }) {
  const allowed = NEXT[order.status] ?? [];
  if (allowed.length === 0) return <StatusBadge status={order.status} />;
  return (
    <select
      value={order.status}
      disabled={busy}
      onChange={(e) => onChange(order, e.target.value)}
      onClick={(e) => e.stopPropagation()}
      className="border border-gray-300 bg-white px-2 py-1.5 text-xs font-semibold outline-none focus:border-accent disabled:opacity-50"
      aria-label={`Change status of ${order.orderNumber}`}
    >
      {ORDER_PROGRESS.map((s) => (
        <option key={s} value={s} disabled={s !== order.status && !allowed.includes(s)}>
          {toStatusLabel(s)}
        </option>
      ))}
    </select>
  );
}

export default function Orders() {
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [overrides, setOverrides] = useState({});
  const toast = useToast();
  const orders = useAsync(() => adminService.getOrders({ status, page }), [status, page]);

  const changeStatus = async (order, next) => {
    setBusyId(order.id);
    try {
      const updated = await adminService.updateOrderStatus(order.id, next);
      setOverrides((o) => ({ ...o, [order.id]: updated }));
      toast.show(`${updated.orderNumber} marked ${toStatusLabel(updated.status)}`);
    } catch (err) {
      toast.show(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const list = orders.data?.content.map((o) => overrides[o.id] ?? o) ?? [];

  return (
    <Panel
      title="View Orders"
      action={
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f || 'all'}
              onClick={() => {
                setStatus(f);
                setPage(0);
              }}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                status === f ? 'bg-primary text-white' : 'border hover:border-primary'
              }`}
            >
              {f ? toStatusLabel(f) : 'All'}
            </button>
          ))}
        </div>
      }
    >
      {orders.loading ? (
        <Spinner />
      ) : orders.error ? (
        <Message tone="error">{getErrorMessage(orders.error)}</Message>
      ) : list.length === 0 ? (
        <Message>No orders found.</Message>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {list.map((o, i) => (
                  <Fragment key={o.id}>
                    <motion.tr
                      {...rowMotion(i)}
                      onClick={() => setExpanded((e) => (e === o.id ? null : o.id))}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <td className="px-5 py-3 font-semibold">{o.orderNumber}</td>
                      <td className="px-5 py-3">
                        <p>{o.customerName}</p>
                        <p className="text-xs text-gray-500">{o.customerEmail}</p>
                      </td>
                      <td className="px-5 py-3">{formatDate(o.createdAt)}</td>
                      <td className="px-5 py-3">{o.items.reduce((n, it) => n + it.quantity, 0)}</td>
                      <td className="px-5 py-3 font-semibold">{formatPrice(o.totalAmount)}</td>
                      <td className="px-5 py-3">
                        <StatusSelect order={o} onChange={changeStatus} busy={busyId === o.id} />
                      </td>
                    </motion.tr>
                    <AnimatePresence>
                      {expanded === o.id && (
                        <tr>
                          <td colSpan={6} className="bg-gray-50 p-0">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="grid gap-4 px-5 py-4 sm:grid-cols-2">
                                <ul className="space-y-1 text-xs">
                                  {o.items.map((it) => (
                                    <li key={it.id} className="flex justify-between gap-2">
                                      <span>
                                        {it.productName} ({it.size}) × {it.quantity}
                                      </span>
                                      <span className="font-semibold">{formatPrice(it.lineTotal)}</span>
                                    </li>
                                  ))}
                                </ul>
                                <address className="text-xs not-italic text-gray-600">
                                  <p className="font-semibold text-primary">{o.shippingAddress.fullName}</p>
                                  <p>{o.shippingAddress.addressLine}</p>
                                  <p>
                                    {o.shippingAddress.city}, {o.shippingAddress.state} - {o.shippingAddress.pincode}
                                  </p>
                                  <p>{o.shippingAddress.phone}</p>
                                </address>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pb-6">
            <Pagination page={page} totalPages={orders.data.totalPages} onChange={setPage} />
          </div>
        </>
      )}
      <Toast message={toast.message} />
    </Panel>
  );
}
