import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { cartService } from '@/services/cartService';
import { useAuth } from './AuthContext';
import type { Cart, CartItem, Product, ProductSize } from '@/types';

interface CartContextValue {
  cart: Cart;
  items: CartItem[];
  count: number;
  total: number;
  loading: boolean;
  /** Item ids with an in-flight request, for disabling controls. */
  pendingIds: number[];
  addToCart: (product: Product, size: ProductSize, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const MAX_QTY = 10;
const GUEST_CART_KEY = 'cjmw_guest_cart';
const EMPTY_CART: Cart = { id: null, items: [], totalItems: 0, totalAmount: 0 };

const CartContext = createContext<CartContextValue | null>(null);

function buildGuestCart(items: CartItem[]): Cart {
  return {
    id: null,
    items,
    totalItems: items.reduce((s, i) => s + i.quantity, 0),
    totalAmount: items.reduce((s, i) => s + i.lineTotal, 0),
  };
}

function readGuestCart(): Cart {
  try {
    const items = JSON.parse(localStorage.getItem(GUEST_CART_KEY) ?? '[]') as CartItem[];
    return buildGuestCart(Array.isArray(items) ? items : []);
  } catch {
    return EMPTY_CART;
  }
}

function writeGuestCart(items: CartItem[]): Cart {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  return buildGuestCart(items);
}

function assertQuantity(quantity: number, stock: number, name: string) {
  if (quantity > MAX_QTY) throw new Error(`Maximum ${MAX_QTY} units per item`);
  if (quantity > stock) throw new Error(`Only ${stock} units of ${name} in stock`);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart>(() => (isAuthenticated ? EMPTY_CART : readGuestCart()));
  // Derived so consumers see loading=true on the very first render after login.
  const [serverSynced, setServerSynced] = useState(false);
  const loading = isAuthenticated && !serverSynced;
  const [pendingIds, setPendingIds] = useState<number[]>([]);
  const guestIdSeq = useRef(0);

  const withPending = useCallback(async (id: number, fn: () => Promise<void>) => {
    setPendingIds((ids) => [...ids, id]);
    try {
      await fn();
    } finally {
      setPendingIds((ids) => ids.filter((x) => x !== id));
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(readGuestCart());
      return;
    }
    setCart(await cartService.get());
  }, [isAuthenticated]);

  // On login, merge any guest items into the server cart, then load the server cart.
  useEffect(() => {
    let active = true;
    if (!isAuthenticated) {
      setServerSynced(false);
      setCart(readGuestCart());
      return;
    }
    (async () => {
      try {
        const guestItems = readGuestCart().items;
        for (const item of guestItems) {
          try {
            await cartService.addItem({ productId: item.productId, size: item.size, quantity: item.quantity });
          } catch {
            // Skip items that are no longer valid (out of stock, removed, etc.).
          }
        }
        if (guestItems.length) localStorage.removeItem(GUEST_CART_KEY);
        const serverCart = await cartService.get();
        if (active) setCart(serverCart);
      } catch {
        if (active) setCart(EMPTY_CART);
      } finally {
        if (active) setServerSynced(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const addToCart = useCallback(
    async (product: Product, size: ProductSize, quantity = 1) => {
      if (!product.availableSizes.includes(size)) {
        throw new Error(`Size ${size} is not available for ${product.name}`);
      }
      if (isAuthenticated) {
        await withPending(product.id, async () => {
          setCart(await cartService.addItem({ productId: product.id, size, quantity }));
        });
        return;
      }
      const items = readGuestCart().items;
      const existing = items.find((i) => i.productId === product.id && i.size === size);
      const newQty = (existing?.quantity ?? 0) + quantity;
      assertQuantity(newQty, product.stockQuantity, product.name);
      const next: CartItem[] = existing
        ? items.map((i) => (i === existing ? { ...i, quantity: newQty, lineTotal: i.unitPrice * newQty } : i))
        : [
            ...items,
            {
              // Negative ids mark local-only guest items.
              id: -(Date.now() + ++guestIdSeq.current),
              productId: product.id,
              productName: product.name,
              imageUrl: product.imageUrl,
              size,
              unitPrice: product.price,
              quantity: newQty,
              lineTotal: product.price * newQty,
              availableStock: product.stockQuantity,
            },
          ];
      setCart(writeGuestCart(next));
    },
    [isAuthenticated, withPending]
  );

  const updateQuantity = useCallback(
    async (itemId: number, quantity: number) => {
      if (quantity < 1) return;
      if (isAuthenticated) {
        await withPending(itemId, async () => {
          setCart(await cartService.updateQuantity(itemId, quantity));
        });
        return;
      }
      const items = readGuestCart().items;
      const target = items.find((i) => i.id === itemId);
      if (!target) return;
      assertQuantity(quantity, target.availableStock, target.productName);
      setCart(
        writeGuestCart(
          items.map((i) => (i.id === itemId ? { ...i, quantity, lineTotal: i.unitPrice * quantity } : i))
        )
      );
    },
    [isAuthenticated, withPending]
  );

  const removeFromCart = useCallback(
    async (itemId: number) => {
      if (isAuthenticated) {
        await withPending(itemId, async () => {
          setCart(await cartService.removeItem(itemId));
        });
        return;
      }
      setCart(writeGuestCart(readGuestCart().items.filter((i) => i.id !== itemId)));
    },
    [isAuthenticated, withPending]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      items: cart.items,
      count: cart.totalItems,
      total: cart.totalAmount,
      loading,
      pendingIds,
      addToCart,
      updateQuantity,
      removeFromCart,
      refresh,
    }),
    [cart, loading, pendingIds, addToCart, updateQuantity, removeFromCart, refresh]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
