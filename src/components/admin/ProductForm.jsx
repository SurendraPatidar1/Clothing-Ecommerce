import { useState } from 'react';
import { getErrorMessage } from '@/services/api';
import { adminService } from '@/services/adminService';
import Button from '@/components/ui/Button';
import ImageUpload from './ImageUpload';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const EMPTY = { name: '', description: '', categoryId: '', price: '', sizes: [], stock: '', imageUrl: '' };

function validate(f, file) {
  const errors = {};
  if (!f.name.trim()) errors.name = 'Product name is required.';
  else if (f.name.length > 150) errors.name = 'Max 150 characters.';
  if (f.description.length > 5000) errors.description = 'Max 5000 characters.';
  if (!f.categoryId) errors.categoryId = 'Select a category.';
  const price = Number(f.price);
  if (!f.price || Number.isNaN(price) || price < 1 || price > 999999.99) errors.price = 'Enter a price between 1 and 999999.99.';
  if (f.sizes.length === 0) errors.sizes = 'Select at least one size.';
  const stock = Number(f.stock);
  if (f.stock === '' || !Number.isInteger(stock) || stock < 0 || stock > 100000) errors.stock = 'Enter a whole number between 0 and 100000.';
  if (f.imageUrl && !/^https:\/\/\S+$/.test(f.imageUrl)) errors.image = 'Image URL must start with https://';
  else if (file && !f.imageUrl) errors.image = 'Paste the hosted https URL for the selected image.';
  return errors;
}

export default function ProductForm({ categories, onCreated, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const toggleSize = (size) =>
    setForm((f) => ({ ...f, sizes: f.sizes.includes(size) ? f.sizes.filter((s) => s !== size) : [...f.sizes, size] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate(form, file);
    setErrors(v);
    if (Object.keys(v).length) return;

    setSaving(true);
    setSubmitError('');
    try {
      const description = form.description.trim();
      const product = await adminService.createProduct({
        name: form.name.trim(),
        description: description || undefined,
        shortDescription: description ? description.slice(0, 255) : undefined,
        categoryId: Number(form.categoryId),
        price: Number(form.price),
        availableSizes: SIZES.filter((s) => form.sizes.includes(s)),
        stockQuantity: Number(form.stock),
        imageUrl: form.imageUrl.trim() || undefined,
      });
      setForm(EMPTY);
      setFile(null);
      onCreated(product);
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'Could not save the product.'));
    } finally {
      setSaving(false);
    }
  };

  const err = (k) => errors[k] && <p className="mt-1 text-xs text-red-600">{errors[k]}</p>;

  return (
    <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div>
          <label className="label" htmlFor="name">Product Name</label>
          <input id="name" className="input" value={form.name} onChange={set('name')} maxLength={150} />
          {err('name')}
        </div>

        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" rows={4} className="input resize-y" value={form.description} onChange={set('description')} />
          {err('description')}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="category">Category</label>
            <select id="category" className="input" value={form.categoryId} onChange={set('categoryId')}>
              <option value="">Select…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {err('categoryId')}
          </div>
          <div>
            <label className="label" htmlFor="price">Price (₹)</label>
            <input id="price" type="number" min="1" step="0.01" className="input" value={form.price} onChange={set('price')} />
            {err('price')}
          </div>
          <div>
            <label className="label" htmlFor="stock">Stock</label>
            <input id="stock" type="number" min="0" step="1" className="input" value={form.stock} onChange={set('stock')} />
            {err('stock')}
          </div>
        </div>

        <div>
          <span className="label">Sizes</span>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => {
              const active = form.sizes.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSize(s)}
                  aria-pressed={active}
                  className={`h-10 min-w-12 border px-3 text-sm font-semibold transition-colors ${
                    active ? 'border-primary bg-primary text-white' : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
          {err('sizes')}
        </div>
      </div>

      <div>
        <span className="label">Product Image</span>
        <ImageUpload
          file={file}
          onFileChange={setFile}
          url={form.imageUrl}
          onUrlChange={(v) => setForm((f) => ({ ...f, imageUrl: v }))}
          error={errors.image}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-end lg:col-span-3">
        {submitError && <p className="text-sm text-red-600 sm:mr-auto">{submitError}</p>}
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="accent" size="sm" disabled={saving}>
          {saving ? 'Saving…' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
}
