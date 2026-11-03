import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
import StatusBadge from '@/components/orders/StatusBadge';
import { useAsync } from '@/hooks/useAsync';
import { orderService } from '@/services/orderService';
import { getErrorMessage } from '@/services/api';
import { formatDate, formatPrice } from '@/utils/helpers';

export default function OrderHistory() {
  const location = useLocation();
  const placedOrder = location.state?.placedOrder;
  const [page, setPage] = useState(0);
  const { data, loading, error } = useAsync(() => orderService.getHistory(page, 10), [page]);
  const orders = data?.content ?? [];

  return (
    <>
      <PageHeader title="Order History" subtitle="Track all your past and current orders." />
      <section className="container-x py-12">
        {placedOrder && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 border-l-4 border-green-600 bg-green-50 px-5 py-4 text-sm text-green-800"
            role="status"
          >
            Thank you! Your order <strong>{placedOrder}</strong> has been placed successfully.
          </motion.p>
        )}
        {loading && <div className="h-40 animate-pulse bg-gray-100" />}
        {error && <p className="text-center text-red-600">{getErrorMessage(error, 'Could not load orders.')}</p>}
        {!loading && !error && !orders.length && (
          <div className="py-16 text-center">
            <p className="text-gray-500">You haven&apos;t placed any orders yet.</p>
            <Button to="/shop" variant="accent" className="mt-6">Start Shopping</Button>
          </div>
        )}
        {!loading && orders.length > 0 && (
          <>
            <div className="hidden overflow-hidden border md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-primary text-xs uppercase tracking-wider text-white">
                  <tr>
                    <th className="px-6 py-4">Order</th>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <motion.tr
                      key={o.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{o.orderNumber}</td>
                      <td className="px-6 py-4 font-medium">{o.product}</td>
                      <td className="px-6 py-4">{formatDate(o.date)}</td>
                      <td className="px-6 py-4 font-semibold">{formatPrice(o.amount)}</td>
                      <td className="px-6 py-4"><StatusBadge status={o.status} /></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="space-y-4 md:hidden">
              {orders.map((o, i) => (
                <motion.li
                  key={o.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="border p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium">{o.product}</p>
                    <StatusBadge status={o.status} />
                  </div>
                  <div className="mt-3 flex justify-between text-sm text-gray-500">
                    <span>{formatDate(o.date)}</span>
                    <span className="font-semibold text-primary">{formatPrice(o.amount)}</span>
                  </div>
                  <p className="mt-2 font-mono text-xs text-gray-400">{o.orderNumber}</p>
                </motion.li>
              ))}
            </ul>

            <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
          </>
        )}
      </section>
    </>
  );
}
