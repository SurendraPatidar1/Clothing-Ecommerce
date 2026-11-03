import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeImage from '@/components/ui/SafeImage';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Toast from '@/components/ui/Toast';
import { useAsync } from '@/hooks/useAsync';
import { useToast } from '@/hooks/useToast';
import { useCart } from '@/context/CartContext';
import { productService } from '@/services/productService';
import { getErrorMessage, isNotFound } from '@/services/api';
import { SITE } from '@/config/site';
import { formatPrice, productEnquiryMessage, whatsappLink } from '@/utils/helpers';

export default function ProductDetails() {
  const { id } = useParams();
  const productId = Number(id);
  const validId = Number.isInteger(productId) && productId > 0;
  const { data: product, loading, error } = useAsync(
    () => (validId ? productService.getById(productId) : Promise.resolve(null)),
    [productId]
  );
  const [size, setSize] = useState('');
  const [formError, setFormError] = useState('');
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();
  const toast = useToast();

  if (loading) {
    return (
      <div className="container-x grid gap-10 py-12 md:grid-cols-2">
        <div className="aspect-[3/4] animate-pulse bg-gray-100" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 animate-pulse bg-gray-100" />
          <div className="h-4 w-1/3 animate-pulse bg-gray-100" />
          <div className="h-24 animate-pulse bg-gray-100" />
        </div>
      </div>
    );
  }

  if (!product) {
    const notFound = !validId || isNotFound(error);
    return (
      <div className="container-x py-32 text-center">
        <h1 className="text-3xl">{notFound ? 'Product not found' : 'Could not load product'}</h1>
        {!notFound && <p className="mt-3 text-gray-500">{getErrorMessage(error)}</p>}
        <Button to="/shop" className="mt-8">Back to Shop</Button>
      </div>
    );
  }

  const handleAdd = async () => {
    if (!size) {
      setFormError('Please select a size');
      return;
    }
    setAdding(true);
    try {
      await addToCart(product, size);
      toast.show(`${product.name} (${size}) added to cart`);
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setAdding(false);
    }
  };

  return (
    <section className="container-x py-10 sm:py-16">
      <nav className="mb-8 text-xs uppercase tracking-wider text-gray-500">
        <Link to="/" className="hover:text-accent">Home</Link> /{' '}
        <Link to={`/shop?category=${product.category}`} className="hover:text-accent">{product.categoryName}</Link> /{' '}
        <span className="text-primary">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="group aspect-[3/4] overflow-hidden bg-gray-100"
        >
          <SafeImage
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex flex-col"
        >
          <p className="text-xs font-semibold uppercase tracking-widest2 text-accent">{product.categoryName}</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{product.name}</h1>
          <p className="mt-4 text-2xl font-bold">{formatPrice(product.price)}</p>
          <p className="mt-1 text-xs text-gray-500">Inclusive of all taxes &middot; {SITE.shipping}</p>
          <p className={`mt-2 text-sm font-medium ${product.inStock ? 'text-green-700' : 'text-red-600'}`}>
            {product.inStock
              ? product.stockQuantity <= 5
                ? `Only ${product.stockQuantity} left in stock`
                : 'In stock'
              : 'Out of stock'}
          </p>
          <p className="mt-6 leading-relaxed text-gray-600">{product.description || product.shortDescription}</p>

          <div className="mt-8">
            <p className="label">Select Size</p>
            <div className="flex flex-wrap gap-3">
              {product.availableSizes.map((s) => (
                <motion.button
                  key={s}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSize(s);
                    setFormError('');
                  }}
                  className={`h-12 w-12 border text-sm font-semibold transition-colors ${
                    size === s ? 'border-primary bg-primary text-white' : 'border-gray-300 hover:border-primary'
                  }`}
                  aria-pressed={size === s}
                >
                  {s}
                </motion.button>
              ))}
            </div>
            {formError && <p className="mt-2 text-sm text-red-600">{formError}</p>}
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <Button variant="primary" size="lg" onClick={handleAdd} disabled={!product.inStock || adding}>
              <Icon name="cart" /> {adding ? 'Adding...' : 'Add To Cart'}
            </Button>
            <Button href={whatsappLink(productEnquiryMessage(product.name, size))} variant="whatsapp" size="lg">
              <Icon name="whatsapp" /> Order on WhatsApp
            </Button>
          </div>

          <ul className="mt-10 space-y-3 border-t pt-8 text-sm text-gray-600">
            <li className="flex items-center gap-3"><Icon name="truck" className="h-5 w-5 text-accent" /> {SITE.shipping}</li>
            <li className="flex items-center gap-3"><Icon name="badge" className="h-5 w-5 text-accent" /> Premium Quality Guaranteed</li>
            <li className="flex items-center gap-3"><Icon name="phone" className="h-5 w-5 text-accent" /> Call / WhatsApp: {SITE.phone}</li>
          </ul>
        </motion.div>
      </div>
      <Toast message={toast.message} />
    </section>
  );
}
