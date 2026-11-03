import api from './api';
import type {
  Category,
  CategoryPayload,
  DashboardSummary,
  Order,
  OrderStatus,
  Page,
  Product,
  ProductPayload,
  User,
} from '@/types';

export const adminService = {
  async getDashboard(): Promise<DashboardSummary> {
    const { data } = await api.get<DashboardSummary>('/admin/dashboard');
    return data;
  },

  async getProducts(params: { search?: string; page?: number; size?: number } = {}): Promise<Page<Product>> {
    const { data } = await api.get<Page<Product>>('/admin/products', {
      params: { search: params.search || undefined, page: params.page ?? 0, size: params.size ?? 10 },
    });
    return data;
  },

  async createProduct(payload: ProductPayload): Promise<Product> {
    const { data } = await api.post<Product>('/admin/products', payload);
    return data;
  },

  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/admin/products/${id}`);
  },

  async restoreProduct(id: number): Promise<Product> {
    const { data } = await api.patch<Product>(`/admin/products/${id}/restore`);
    return data;
  },

  async getCategories(): Promise<Category[]> {
    const { data } = await api.get<Category[]>('/admin/categories');
    return data;
  },

  async createCategory(payload: CategoryPayload): Promise<Category> {
    const { data } = await api.post<Category>('/admin/categories', payload);
    return data;
  },

  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/admin/categories/${id}`);
  },

  async getOrders(params: { status?: OrderStatus; page?: number; size?: number } = {}): Promise<Page<Order>> {
    const { data } = await api.get<Page<Order>>('/admin/orders', {
      params: { status: params.status || undefined, page: params.page ?? 0, size: params.size ?? 10 },
    });
    return data;
  },

  async updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
    const { data } = await api.patch<Order>(`/admin/orders/${id}/status`, { status });
    return data;
  },

  async getUsers(params: { search?: string; page?: number; size?: number } = {}): Promise<Page<User>> {
    const { data } = await api.get<Page<User>>('/admin/users', {
      params: { search: params.search || undefined, page: params.page ?? 0, size: params.size ?? 10 },
    });
    return data;
  },
};
