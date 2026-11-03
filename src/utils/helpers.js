import { SITE } from '@/config/site';

export const formatPrice = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const whatsappLink = (message = '') =>
  `https://wa.me/${SITE.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

export const productEnquiryMessage = (productName, size) =>
  `Hello,\nI am interested in:\n\nProduct Name: ${productName}\nSelected Size: ${size || 'Not selected'}\n\nPlease provide details.`;

export const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  try {
    const u = new URL(url);
    let id = '';
    if (u.hostname.includes('youtu.be')) id = u.pathname.slice(1);
    else if (u.pathname.startsWith('/shorts/') || u.pathname.startsWith('/embed/')) id = u.pathname.split('/')[2];
    else id = u.searchParams.get('v') || '';
    return /^[\w-]{6,20}$/.test(id) ? `https://www.youtube.com/embed/${id}` : '';
  } catch {
    return '';
  }
};

export const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"><rect width="100%" height="100%" fill="#111827"/><text x="50%" y="50%" fill="#d97706" font-family="serif" font-size="32" text-anchor="middle">Choubey Ji</text></svg>`
  );
