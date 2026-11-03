import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeImage from '@/components/ui/SafeImage';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/utils/helpers';
import { fadeUp } from '@/animations/variants';

export default function ProductCard({ product, onAddToCart, adding = false }) {
  const outOfStock = !product.inStock;

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group flex flex-col bg-white shadow-sm transition-shadow duration-300 hover:shadow-2xl"
    >
      <Link to={`/product/${product.id}`} className="relative block aspect-[3/4] overflow-hidden bg-gray-100">
        <SafeImage
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <span className="absolute left-3 top-3 bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest">
          {product.categoryName}
        </span>
        {outOfStock && (
          <span className="absolute right-3 top-3 bg-red-600 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
            Sold Out
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-sans text-base font-semibold">{product.name}</h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-gray-500">{product.shortDescription}</p>
        <p className="mt-3 text-lg font-bold text-accent">{formatPrice(product.price)}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button to={`/product/${product.id}`} variant="outline" size="sm">
            View Details
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={outOfStock || adding}
            onClick={() => onAddToCart?.(product)}
          >
            {adding ? 'Adding...' : 'Add To Cart'}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
