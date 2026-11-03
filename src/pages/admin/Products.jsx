import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAsync } from '@/hooks/useAsync';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/adminService';
import { getErrorMessage } from '@/services/api';
import { formatPrice } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Pagination from '@/components/ui/Pagination';
import SafeImage from '@/components/ui/SafeImage';
import Toast from '@/components/ui/Toast';
import ProductForm from '@/components/admin/ProductForm';
import { Message, Panel, Spinner, rowMotion } from '@/components/admin/AdminUI';

export default function Products() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [reload, setReload] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const toast = useToast();

  const categories = useAsync(() => adminService.getCategories(), []);
  const products = useAsync(() => adminService.getProducts({ search: query, page }), [query, page, reload]);

  const refresh = () => setReload((r) => r + 1);

  const toggleActive = async (p) => {
    try {
      if (p.active) await adminService.deleteProduct(p.id);
      else await adminService.restoreProduct(p.id);
      toast.show(p.active ? 'Product deactivated' : 'Product restored');
      refresh();
    } catch (err) {
      toast.show(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence initial={false}>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Panel title="Add Product">
              {categories.error ? (
                <Message tone="error">{getErrorMessage(categories.error)}</Message>
              ) : (
                <ProductForm
                  categories={categories.data ?? []}
                  onCancel={() => setShowForm(false)}
                  onCreated={(p) => {
                    toast.show(`"${p.name}" added`);
                    setShowForm(false);
                    setPage(0);
                    refresh();
                  }}
                />
              )}
            </Panel>
          </motion.div>
        )}
      </AnimatePresence>

      <Panel
        title="All Products"
        action={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPage(0);
                setQuery(search.trim());
              }}
              className="relative"
            >
              <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                className="input py-2 pl-9 sm:w-60"
                placeholder="Search products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
            {!showForm && (
              <Button variant="accent" size="sm" onClick={() => setShowForm(true)}>
                <Icon name="plus" className="h-4 w-4" /> Add Product
              </Button>
            )}
          </div>
        }
      >
        {products.loading ? (
          <Spinner />
        ) : products.error ? (
          <Message tone="error">{getErrorMessage(products.error)}</Message>
        ) : products.data.content.length === 0 ? (
          <Message>No products found.</Message>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-5 py-3">Product</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Price</th>
                    <th className="px-5 py-3">Sizes</th>
                    <th className="px-5 py-3">Stock</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.data.content.map((p, i) => (
                    <motion.tr key={p.id} {...rowMotion(i)} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <SafeImage src={p.imageUrl} alt={p.name} className="h-12 w-10 shrink-0 rounded object-cover" />
                          <span className="font-medium">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">{p.categoryName}</td>
                      <td className="px-5 py-3 font-semibold">{formatPrice(p.price)}</td>
                      <td className="px-5 py-3 text-xs">{p.availableSizes.join(', ')}</td>
                      <td className={`px-5 py-3 ${p.stockQuantity <= 5 ? 'font-semibold text-red-600' : ''}`}>{p.stockQuantity}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2 py-1 text-[11px] font-semibold uppercase ${
                            p.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {p.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => toggleActive(p)}
                          className={`text-xs font-semibold uppercase tracking-wider hover:underline ${
                            p.active ? 'text-red-600' : 'text-green-700'
                          }`}
                        >
                          {p.active ? 'Deactivate' : 'Restore'}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pb-6">
              <Pagination page={page} totalPages={products.data.totalPages} onChange={setPage} />
            </div>
          </>
        )}
      </Panel>
      <Toast message={toast.message} />
    </div>
  );
}
