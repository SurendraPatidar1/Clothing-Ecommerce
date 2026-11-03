import type { OrderStatus } from '@/types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  PLACED: 'Placed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

/** Converts a backend status (e.g. "PLACED") to a display label (e.g. "Placed"). Use the raw value for API calls. */
export function toStatusLabel(status: OrderStatus | string): string {
  return STATUS_LABELS[status as OrderStatus] ?? status.charAt(0) + status.slice(1).toLowerCase();
}

/** Converts a display label back to the backend status value. */
export function toStatusCode(label: string): OrderStatus | undefined {
  const match = (Object.entries(STATUS_LABELS) as [OrderStatus, string][]).find(
    ([, l]) => l.toLowerCase() === label.trim().toLowerCase()
  );
  return match?.[0];
}

export const ORDER_PROGRESS: OrderStatus[] = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
