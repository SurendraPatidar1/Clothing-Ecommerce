import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageHeader from '@/components/layout/PageHeader';
import ProductGrid from '@/components/product/ProductGrid';
import Pagination from '@/components/ui/Pagination';
import { CATEGORIES } from '@/config/site';
import { useAsync } from '@/hooks/useAsync';
import { productService } from '@/services/productService';

const PAGE_SIZE = 12;

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const active = params.get('category') || '';
  const page = Math.max(0, Number.parseInt(params.get('page') ?? '0', 10) || 0);

  const { data, loading, error } = useAsync(
    () => productService.getAll({ category: active || undefined, page, size: PAGE_SIZE }),
    [active, page]
  );

  const tabs = [{ slug: '', name: 'All' }, ...CATEGORIES];

  const goToPage = (p) => {
    const next = new URLSearchParams(params);
    if (p > 0) next.set('page', String(p));
    else next.delete('page');
    setParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <PageHeader title="Shop" subtitle="Explore our premium range of menswear." />
      <section className="container-x py-12">
        <div className="mb-10 flex flex-wrap justify-center gap-2 sm:gap-4">
          {tabs.map((t) => (
            <button
              key={t.slug}
              onClick={() => setParams(t.slug ? { category: t.slug } : {})}
              className={`relative px-5 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
                active === t.slug ? 'text-white' : 'text-primary hover:text-accent'
              }`}
            >
              {active === t.slug && (
                <motion.span layoutId="shop-tab" className="absolute inset-0 bg-primary" transition={{ type: 'spring', duration: 0.5 }} />
              )}
              <span className="relative">{t.name}</span>
            </button>
          ))}
        </div>

        {data && !loading && (
          <p className="mb-6 text-xs uppercase tracking-wider text-gray-500">
            {data.totalElements} product{data.totalElements === 1 ? '' : 's'}
          </p>
        )}

        <ProductGrid key={`${active}-${page}`} products={data?.content} loading={loading} error={error} />

        {data && <Pagination page={data.page} totalPages={data.totalPages} onChange={goToPage} />}
      </section>
    </>
  );
}
