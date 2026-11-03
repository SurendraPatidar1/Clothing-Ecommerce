import { useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import Toast from '@/components/ui/Toast';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/services/api';
import { stagger } from '@/animations/variants';

const preferredSize = (product) =>
  product.availableSizes.includes('M') ? 'M' : product.availableSizes[0];

export default function ProductGrid({ products, loading, error }) {
  const { addToCart } = useCart();
  const toast = useToast();
  const [addingId, setAddingId] = useState(null);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-[3/5] animate-pulse bg-gray-100" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="py-20 text-center text-red-600">{getErrorMessage(error, 'Could not load products.')}</p>;
  }

  if (!products?.length) {
    return <p className="py-20 text-center text-gray-500">No products found.</p>;
  }

  const handleAdd = async (product) => {
    const size = preferredSize(product);
    if (!size) {
      toast.show('No sizes available for this product');
      return;
    }
    setAddingId(product.id);
    try {
      await addToCart(product, size);
      toast.show(`${product.name} (${size}) added to cart`);
    } catch (err) {
      toast.show(getErrorMessage(err));
    } finally {
      setAddingId(null);
    }
  };

  return (
    <>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAddToCart={handleAdd} adding={addingId === p.id} />
        ))}
      </motion.div>
      <Toast message={toast.message} />
    </>
  );
}
