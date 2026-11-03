import api from './api';
import type { Order, OrderStatusInfo, OrderSummary, Page, ShippingAddress } from '@/types';

export const orderService = {
  /** Places an order from the user's server-side cart. */
  async place(shippingAddress: ShippingAddress): Promise<Order> {
    const { data } = await api.post<Order>('/orders', { shippingAddress });
    return data;
  },

  async getHistory(page = 0, size = 10): Promise<Page<OrderSummary>> {
    const { data } = await api.get<Page<OrderSummary>>('/orders/me', { params: { page, size } });
    return data;
  },

  async getById(id: number): Promise<Order> {
    const { data } = await api.get<Order>(`/orders/${id}`);
    return data;
  },

  async getStatus(id: number): Promise<OrderStatusInfo> {
    const { data } = await api.get<OrderStatusInfo>(`/orders/${id}/status`);
    return data;
  },

  async cancel(id: number): Promise<Order> {
    const { data } = await api.patch<Order>(`/orders/${id}/cancel`);
    return data;
  },
};
