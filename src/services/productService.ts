import api from './api';
import type { Page, Product, ProductQuery } from '@/types';

export const productService = {
  async getAll(query: ProductQuery = {}): Promise<Page<Product>> {
    const { data } = await api.get<Page<Product>>('/products', {
      params: {
        category: query.category || undefined,
        featured: query.featured,
        search: query.search || undefined,
        page: query.page ?? 0,
        size: query.size ?? 12,
        sort: query.sort,
      },
    });
    return data;
  },

  async getFeatured(size = 8): Promise<Product[]> {
    const page = await productService.getAll({ featured: true, size });
    return page.content;
  },

  async getById(id: number): Promise<Product> {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  },
};
