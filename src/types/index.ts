export type ProductSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type OrderStatus = 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export type Role = 'ROLE_USER' | 'ROLE_ADMIN';

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface Product {
  id: number;
  name: string;
  shortDescription: string | null;
  description: string | null;
  categoryId: number;
  category: string;
  categoryName: string;
  price: number;
  imageUrl: string | null;
  availableSizes: ProductSize[];
  stockQuantity: number;
  inStock: boolean;
  featured: boolean;
  active: boolean;
  createdAt: string;
}

export interface ProductQuery {
  category?: string;
  featured?: boolean;
  search?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string | null;
  size: ProductSize;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  availableStock: number;
}

export interface Cart {
  id: number | null;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

export interface AddToCartPayload {
  productId: number;
  size: ProductSize;
  quantity: number;
}

/** Shape sent to and returned by the backend. */
export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

/** Shape of the checkout form (two address lines are merged before sending). */
export interface ShippingAddressForm {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string | null;
  size: ProductSize;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  customerId: number;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderSummary {
  id: number;
  orderNumber: string;
  product: string;
  itemCount: number;
  amount: number;
  status: OrderStatus;
  date: string;
}

export interface OrderStatusInfo {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  cancellable: boolean;
  nextStatuses: OrderStatus[];
  lastUpdated: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: Role;
  enabled: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresInMs: number;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
}

export interface CategoryPayload {
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
}

export interface ProductPayload {
  name: string;
  shortDescription?: string;
  description?: string;
  categoryId: number;
  price: number;
  imageUrl?: string;
  availableSizes: ProductSize[];
  stockQuantity: number;
  featured?: boolean;
}

export interface DashboardSummary {
  totalUsers: number;
  totalAdmins: number;
  totalCategories: number;
  activeProducts: number;
  lowStockProducts: number;
  totalOrders: number;
  ordersByStatus: Partial<Record<OrderStatus, number>>;
  totalRevenue: number;
}

export interface ApiErrorBody {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors?: Record<string, string>;
}
