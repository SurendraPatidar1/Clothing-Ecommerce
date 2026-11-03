import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '@/components/ui/Icon';

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Lets the admin pick a local image (for preview) and/or provide the hosted https URL that is saved with the product.
 * The backend stores image URLs only, so the file must be hosted elsewhere until an upload endpoint exists.
 */
export default function ImageUpload({ file, onFileChange, url, onUrlChange, error }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState('');
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (!file) {
      setPreview('');
      return undefined;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const pick = (f) => {
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) return setFileError('Only JPG, PNG or WEBP images are allowed.');
    if (f.size > MAX_BYTES) return setFileError('Image must be 5 MB or smaller.');
    setFileError('');
    onFileChange(f);
  };

  const shown = preview || (/^https:\/\//.test(url) ? url : '');

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pick(e.dataTransfer.files?.[0]);
        }}
        className={`relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
          dragging ? 'border-accent bg-amber-50' : 'border-gray-300 hover:border-accent'
        }`}
      >
        <AnimatePresence mode="wait">
          {shown ? (
            <motion.img
              key={shown}
              src={shown}
              alt="Product preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-h-48 rounded object-contain"
            />
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Icon name="upload" className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm font-medium">Drag &amp; drop or click to upload</p>
              <p className="text-xs text-gray-500">JPG, PNG, WEBP up to 5 MB</p>
            </motion.div>
          )}
        </AnimatePresence>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          className="hidden"
          onChange={(e) => {
            pick(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>

      {file && (
        <div className="flex items-center justify-between gap-2 text-xs text-gray-600">
          <span className="truncate">{file.name}</span>
          <button type="button" onClick={() => onFileChange(null)} className="font-semibold text-red-600 hover:underline">
            Remove
          </button>
        </div>
      )}

      <div>
        <label className="label" htmlFor="imageUrl">
          Hosted Image URL
        </label>
        <input
          id="imageUrl"
          type="url"
          className="input"
          placeholder="https://..."
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
        />
      </div>

      {(fileError || error) && <p className="text-xs text-red-600">{fileError || error}</p>}
    </div>
  );
}
