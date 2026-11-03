import { useState } from 'react';
import { FALLBACK_IMAGE } from '@/utils/helpers';

export default function SafeImage({ src, alt, className = '', ...props }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const showFallback = !src || failedSrc === src;
  return (
    <img
      src={showFallback ? FALLBACK_IMAGE : src}
      alt={alt}
      loading="lazy"
      onError={() => setFailedSrc(src)}
      className={className}
      {...props}
    />
  );
}
