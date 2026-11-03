import SectionHeading from '@/components/ui/SectionHeading';
import ProductGrid from '@/components/product/ProductGrid';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { useAsync } from '@/hooks/useAsync';
import { productService } from '@/services/productService';

export default function FeaturedProducts() {
  const { data, loading, error } = useAsync(() => productService.getFeatured(8), []);

  return (
    <section className="bg-gray-50 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading eyebrow="Trending Now" title="Featured Products" subtitle="Handpicked bestsellers from our latest drop." />
        <ProductGrid products={data} loading={loading} error={error} />
        <Reveal className="mt-12 text-center">
          <Button to="/shop" variant="outline" size="lg">
            View All Products
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
