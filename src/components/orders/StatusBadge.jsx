import { toStatusLabel } from '@/utils/orderStatus';

const STYLES = {
  PLACED: 'bg-gray-100 text-gray-700',
  PROCESSING: 'bg-amber-100 text-amber-800',
  SHIPPED: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-700',
};

/** Accepts the raw backend status (e.g. "PLACED") and renders its display label. */
export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block whitespace-nowrap px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${
        STYLES[status] || STYLES.PLACED
      }`}
    >
      {toStatusLabel(status)}
    </span>
  );
}
