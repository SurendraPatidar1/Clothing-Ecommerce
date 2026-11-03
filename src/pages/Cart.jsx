import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PageHeader from '@/components/layout/PageHeader';
import SafeImage from '@/components/ui/SafeImage';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/services/api';
import { formatPrice } from '@/utils/helpers';

export default function Cart() {
  const { items, total, count, loading, pendingIds, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const run = async (fn) => {
    setError('');
    try {
      await fn();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) {
    return (
      <>
        <PageHeader title="Your Cart" />
        <div className="container-x space-y-4 py-12">
          {[0, 1].map((i) => <div key={i} className="h-28 animate-pulse bg-gray-100" />)}
        </div>
      </>
    );
  }

  if (!items.length) {
    return (
      <>
        <PageHeader title="Your Cart" />
        <div className="container-x py-24 text-center">
          <Icon name="cart" className="mx-auto h-16 w-16 text-gray-300" />
          <p className="mt-6 text-gray-500">Your cart is empty.</p>
          <Button to="/shop" variant="accent" size="lg" className="mt-8">
            Continue Shopping
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Your Cart" subtitle={`${count} item${count === 1 ? '' : 's'}`} />
      <section className="container-x grid gap-10 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {error && <p className="mb-4 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
          <div className="hidden grid-cols-12 border-b pb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 md:grid">
            <span className="col-span-6">Product</span>
            <span className="col-span-3 text-center">Quantity</span>
            <span className="col-span-3 text-right">Price</span>
          </div>
          <ul>
            <AnimatePresence initial={false}>
              {items.map((item) => {
                const pending = pendingIds.includes(item.id);
                const maxQty = Math.min(10, item.availableStock);
                return (
                  <motion.li
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: pending ? 0.6 : 1, x: 0 }}
                    exit={{ opacity: 0, x: 40, height: 0 }}
                    className="grid grid-cols-12 items-center gap-4 border-b py-6"
                  >
                    <div className="col-span-12 flex items-center gap-4 md:col-span-6">
                      <Link to={`/product/${item.productId}`} className="h-24 w-20 flex-shrink-0 overflow-hidden bg-gray-100">
                        <SafeImage src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
                      </Link>
                      <div>
                        <Link to={`/product/${item.productId}`} className="font-semibold hover:text-accent">
                          {item.productName}
                        </Link>
                        <p className="mt-1 text-xs uppercase tracking-wider text-gray-500">Size: {item.size}</p>
                        <p className="mt-1 text-sm text-gray-500">{formatPrice(item.unitPrice)} each</p>
                        <button
                          onClick={() => run(() => removeFromCart(item.id))}
                          disabled={pending}
                          className="mt-2 flex items-center gap-1 text-xs text-red-600 hover:underline disabled:opacity-50"
                        >
                          <Icon name="trash" className="h-4 w-4" /> Remove
                        </button>
                      </div>
                    </div>
                    <div className="col-span-6 flex justify-start md:col-span-3 md:justify-center">
                      <div className="flex items-center border border-gray-300">
                        <button
                          className="h-9 w-9 hover:bg-gray-100 disabled:opacity-40"
                          onClick={() => run(() => updateQuantity(item.id, item.quantity - 1))}
                          disabled={pending || item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          &minus;
                        </button>
                        <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          className="h-9 w-9 hover:bg-gray-100 disabled:opacity-40"
                          onClick={() => run(() => updateQuantity(item.id, item.quantity + 1))}
                          disabled={pending || item.quantity >= maxQty}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <p className="col-span-6 text-right font-semibold md:col-span-3">{formatPrice(item.lineTotal)}</p>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </div>

        <motion.aside
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-fit bg-gray-50 p-8 lg:sticky lg:top-28"
        >
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Subtotal</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Shipping</dt>
              <dd className="text-green-700">Free</dd>
            </div>
            <div className="flex justify-between border-t pt-4 text-lg font-bold">
              <dt>Total Amount</dt>
              <dd className="text-accent">{formatPrice(total)}</dd>
            </div>
          </dl>
          <Button
            variant="accent"
            size="lg"
            className="mt-8 w-full"
            onClick={() => navigate('/checkout')}
            disabled={pendingIds.length > 0}
          >
            Proceed To Checkout
          </Button>
          {!isAuthenticated && (
            <p className="mt-3 text-center text-xs text-gray-500">You will be asked to log in. Your cart will be saved.</p>
          )}
        </motion.aside>
      </section>
    </>
  );
}
