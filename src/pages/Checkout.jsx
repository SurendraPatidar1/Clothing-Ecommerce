import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageHeader from '@/components/layout/PageHeader';
import ShippingAddressForm from '@/components/checkout/ShippingAddressForm';
import SafeImage from '@/components/ui/SafeImage';
import Button from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/orderService';
import { getErrorMessage } from '@/services/api';
import { formatPrice } from '@/utils/helpers';
import { EMPTY_SHIPPING_FORM, toShippingAddress, validateShippingAddress } from '@/utils/shippingAddress';

export default function Checkout() {
  const { items, total, loading, refresh } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(() => ({
    ...EMPTY_SHIPPING_FORM,
    fullName: user?.name ?? '',
    phone: user?.phone ?? '',
  }));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [placing, setPlacing] = useState(false);

  if (!loading && !items.length && !placing) {
    return <Navigate to="/cart" replace />;
  }

  const onChange = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const validation = validateShippingAddress(form);
    setErrors(validation);
    if (Object.keys(validation).length) {
      document.getElementById(Object.keys(validation)[0])?.focus();
      return;
    }
    setPlacing(true);
    setSubmitError('');
    try {
      // The backend builds the order from the server-side cart.
      const order = await orderService.place(toShippingAddress(form));
      await refresh();
      navigate('/orders', { replace: true, state: { placedOrder: order.orderNumber } });
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'Could not place order. Please try again.'));
      await refresh().catch(() => {});
      setPlacing(false);
    }
  };

  return (
    <>
      <PageHeader title="Checkout" subtitle="Enter your shipping details. We ship across India." />
      <form onSubmit={onSubmit} noValidate className="container-x grid gap-10 py-12 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <h2 className="mb-6 text-xl font-semibold">Shipping Address</h2>
          <ShippingAddressForm values={form} errors={errors} onChange={onChange} disabled={placing} />
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="h-fit bg-gray-50 p-8 lg:sticky lg:top-28"
        >
          <h2 className="text-xl font-semibold">Your Order</h2>
          <ul className="mt-6 max-h-72 space-y-4 overflow-y-auto">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3">
                <div className="h-16 w-14 flex-shrink-0 overflow-hidden bg-gray-200">
                  <SafeImage src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-xs text-gray-500">Size {item.size} &middot; Qty {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">{formatPrice(item.lineTotal)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-3 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Shipping</dt>
              <dd className="text-green-700">Free</dd>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <dt>Total</dt>
              <dd className="text-accent">{formatPrice(total)}</dd>
            </div>
          </dl>
          {submitError && <p className="mt-4 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{submitError}</p>}
          <Button type="submit" variant="accent" size="lg" className="mt-6 w-full" disabled={placing || loading}>
            {placing ? 'Placing Order...' : 'Place Order'}
          </Button>
        </motion.aside>
      </form>
    </>
  );
}
