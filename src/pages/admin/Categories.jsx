import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAsync } from '@/hooks/useAsync';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/adminService';
import { getErrorMessage } from '@/services/api';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import SafeImage from '@/components/ui/SafeImage';
import Toast from '@/components/ui/Toast';
import { Message, Panel, Spinner } from '@/components/admin/AdminUI';

const EMPTY = { name: '', description: '', imageUrl: '' };

export default function Categories() {
  const [reload, setReload] = useState(0);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const categories = useAsync(() => adminService.getCategories(), [reload]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Category name is required.');
    if (form.imageUrl && !/^https:\/\/\S+$/.test(form.imageUrl)) return setError('Image URL must start with https://');
    setSaving(true);
    setError('');
    try {
      const c = await adminService.createCategory({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        imageUrl: form.imageUrl.trim() || undefined,
      });
      setForm(EMPTY);
      toast.show(`"${c.name}" added`);
      setReload((r) => r + 1);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not save the category.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete category "${c.name}"?`)) return;
    try {
      await adminService.deleteCategory(c.id);
      toast.show('Category deleted');
      setReload((r) => r + 1);
    } catch (err) {
      toast.show(getErrorMessage(err));
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <Panel title="Add Category" className="h-fit">
        <form onSubmit={handleSubmit} noValidate className="space-y-4 p-5">
          <div>
            <label className="label" htmlFor="cat-name">Name</label>
            <input id="cat-name" className="input" maxLength={60} value={form.name} onChange={set('name')} />
          </div>
          <div>
            <label className="label" htmlFor="cat-desc">Description</label>
            <textarea id="cat-desc" rows={3} maxLength={500} className="input" value={form.description} onChange={set('description')} />
          </div>
          <div>
            <label className="label" htmlFor="cat-img">Image URL</label>
            <input id="cat-img" type="url" className="input" placeholder="https://..." value={form.imageUrl} onChange={set('imageUrl')} />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <Button type="submit" variant="accent" size="sm" className="w-full" disabled={saving}>
            <Icon name="plus" className="h-4 w-4" /> {saving ? 'Saving…' : 'Add Category'}
          </Button>
        </form>
      </Panel>

      <Panel title="All Categories" className="xl:col-span-2">
        {categories.loading ? (
          <Spinner />
        ) : categories.error ? (
          <Message tone="error">{getErrorMessage(categories.error)}</Message>
        ) : categories.data.length === 0 ? (
          <Message>No categories yet.</Message>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            {categories.data.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 rounded-lg border p-3"
              >
                <SafeImage src={c.imageUrl} alt={c.name} className="h-16 w-16 shrink-0 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-gray-500">/{c.slug}</p>
                  {c.description && <p className="mt-1 line-clamp-2 text-xs text-gray-600">{c.description}</p>}
                </div>
                <button onClick={() => handleDelete(c)} className="text-gray-400 hover:text-red-600" aria-label={`Delete ${c.name}`}>
                  <Icon name="trash" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </Panel>
      <Toast message={toast.message} />
    </div>
  );
}
