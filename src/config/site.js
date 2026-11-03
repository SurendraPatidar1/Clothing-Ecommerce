export const SITE = {
  name: 'Choubey Ji Mens Wear',
  tagline: "Premium Men's Fashion",
  address: {
    line1: 'Lalita Nagar',
    line2: 'Kolar Road',
    city: 'Bhopal',
  },
  shipping: 'All India Shipping',
  phone: '7697044210',
  whatsapp: '917697044210',
  youtubeUrl: import.meta.env.VITE_YOUTUBE_URL || '',
  mapEmbedUrl:
    import.meta.env.VITE_MAP_EMBED_URL ||
    'https://www.google.com/maps?q=Lalita+Nagar,+Kolar+Road,+Bhopal&output=embed',
};

export const CATEGORIES = [
  {
    slug: 'jeans',
    name: 'Jeans',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
  },
  {
    slug: 'shirts',
    name: 'Shirts',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
  },
  {
    slug: 't-shirts',
    name: 'T-Shirts',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
  },
  {
    slug: 'trousers',
    name: 'Trousers',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80',
  },
];

export const SIZES = ['S', 'M', 'L', 'XL'];
