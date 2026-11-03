import api from './api';
import type { AddToCartPayload, Cart } from '@/types';

export const cartService = {
  async get(): Promise<Cart> {
    const { data } = await api.get<Cart>('/cart');
    return data;
  },

  async addItem(payload: AddToCartPayload): Promise<Cart> {
    const { data } = await api.post<Cart>('/cart/items', payload);
    return data;
  },

  async updateQuantity(itemId: number, quantity: number): Promise<Cart> {
    const { data } = await api.put<Cart>(`/cart/items/${itemId}`, { quantity });
    return data;
  },

  async removeItem(itemId: number): Promise<Cart> {
    const { data } = await api.delete<Cart>(`/cart/items/${itemId}`);
    return data;
  },

  async clear(): Promise<Cart> {
    const { data } = await api.delete<Cart>('/cart');
    return data;
  },
};
